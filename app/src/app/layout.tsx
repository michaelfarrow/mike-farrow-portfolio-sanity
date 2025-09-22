import { VisualEditing } from 'next-sanity/visual-editing';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { draftMode } from 'next/headers';

import { config } from '@common/config';

import { SanityLive } from '@app/lib/sanity/live';

import { DisableDraftMode } from '@app/components/DisableDraftMode';

import '@app/styles/code.css';
import '@app/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: config.title,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
