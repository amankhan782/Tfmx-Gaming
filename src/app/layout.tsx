import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'TFMX Gaming — Building Worlds. Creating Experiences.',
  description: 'Meet TFMX Gaming and explore the world of Indian Car Simulator, an open-world driving game in development.',
  metadataBase: new URL('https://example.com'),
  openGraph: { title:'TFMX Gaming', description:'Building Worlds. Creating Experiences.', type:'website', images:['/game-world/city.jpg'] },
  twitter:{ card:'summary_large_image', title:'TFMX Gaming', description:'Indian Car Simulator — in development.' }
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}