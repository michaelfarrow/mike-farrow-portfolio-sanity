import { VisualEditing } from 'next-sanity/visual-editing';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { draftMode } from 'next/headers';

import { config } from '@common/config';

import { DisableDraftMode } from '@app/components/disable-draft-mode';

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
  const draftModeEnabled = (await draftMode()).isEnabled;

  return (
    <html lang='en' className={(draftModeEnabled && 'draft-mode') || undefined}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        {draftModeEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
