import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
const schema=z.object({
 type:z.enum(['early','team','contact']),name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),
 country:z.string().trim().min(2).max(80).optional(),experience:z.string().trim().min(1).max(1000).optional(),
 reason:z.string().trim().min(10).max(2000),device:z.string().max(100).optional(),
 whatsapp:z.string().max(40).optional(),role:z.string().max(100).optional(),
 portfolio:z.string().url().max(500).optional().or(z.literal('')),message:z.string().max(2000).optional()
});
const hits=new Map<string,{count:number;at:number}>();
export async function POST(req:NextRequest){
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
 const now=Date.now(),entry=hits.get(ip);
 if(entry&&now-entry.at<60_000&&entry.count>=5)return NextResponse.json({error:'Too many submissions. Please try again in a minute.'},{status:429});
 hits.set(ip,{count:entry&&now-entry.at<60_000?entry.count+1:1,at:now});
 let body:unknown;try{body=await req.json()}catch{return NextResponse.json({error:'Invalid request body.'},{status:400})}
 const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:'Please check the form fields and try again.'},{status:400});
 const {type,...data}=parsed.data;
 const key=process.env.RESEND_API_KEY,from=process.env.FROM_EMAIL,to=process.env.OWNER_EMAIL||'amanbgm782@gmail.com';
 if(!key||!from)return NextResponse.json({error:'Email is not configured yet. Please contact TFMX directly on WhatsApp or email.'},{status:503});
 const title=type==='early'?'Early Access Request':type==='team'?'Development Team Application':'Website Contact Message';
 const rows=Object.entries(data).map(([k,v])=>`<tr><td style="padding:9px;border-bottom:1px solid #333;color:#aaa">${escapeHtml(k)}</td><td style="padding:9px;border-bottom:1px solid #333;color:#fff">${escapeHtml(String(v||'—'))}</td></tr>`).join('');
 const html=`<div style="background:#090a0b;padding:32px;color:white;font-family:Arial"><h1 style="color:#f5a623">${title}</h1><p>New submission for TFMX Gaming.</p><table style="width:100%;border-collapse:collapse">${rows}</table></div>`;
 try{
  const send=async(toEmail:string,subject:string,content:string)=>fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[toEmail],subject,html:content})});
  const owner=await send(to,title,html);if(!owner.ok)throw new Error('Notification email failed');
  const confirmation=`<div style="font-family:Arial;background:#090a0b;color:white;padding:32px"><h2 style="color:#f5a623">Thanks for reaching out.</h2><p>Hi ${escapeHtml(data.name)}, we received your ${type==='early'?'Early Access request':type==='team'?'collaboration application':'contact message'} for TFMX Gaming. We’ll review it and contact you if there’s a suitable next step.</p><p>— TFMX Gaming</p></div>`;
  await send(data.email,'We received your request — TFMX Gaming',confirmation).catch(()=>null);
  return NextResponse.json({message:'Your request has been submitted successfully. Thanks for your interest!'});
 }catch{return NextResponse.json({error:'We could not send your request. Please try again later or contact us directly.'},{status:502})}
}
function escapeHtml(v:string){return v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] as string));}
