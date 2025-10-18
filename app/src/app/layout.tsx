import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { draftMode } from 'next/headers';

import { config } from '@app/lib/config';
import { DraftMode } from '@app/components/studio/draft-mode';

import '@app/styles/code.css';
import '@app/styles/globals.css';

import React from 'react';

import { Logo } from '@app/components/global/logo';
import { Navigation } from '@app/components/global/navigation';
import { Container } from '@app/components/page/container';

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
        <header>
          <Container>
            <Logo />
            <Navigation />
          </Container>
        </header>
        {children}
        <DraftMode enabled={draftModeEnabled} />
      </body>
    </html>
  );
}
