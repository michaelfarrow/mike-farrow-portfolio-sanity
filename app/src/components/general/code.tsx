import {
  hasLanguage,
  Refractor,
  RefractorProps,
  registerLanguage,
} from 'react-refractor';
import arduino from 'refractor/arduino';
import bash from 'refractor/bash';
import css from 'refractor/css';
import js from 'refractor/jsx';
import html from 'refractor/markup';
import shell from 'refractor/shell-session';
import ts from 'refractor/tsx';
import React from 'react';

registerLanguage(arduino);
registerLanguage(bash);
registerLanguage(css);
registerLanguage(js);
registerLanguage(ts);
registerLanguage(html);
registerLanguage(shell);

const MAP: Record<string, string> = {
  javascript: 'jsx',
  typescript: 'tsx',
};

export type SanityCodeProps = RefractorProps;

export function Code({ language, ...rest }: SanityCodeProps) {
  const _language = MAP[language] || language;
  return (
    <Refractor
      language={hasLanguage(_language) ? _language : 'plaintext'}
      {...rest}
    />
  );
}
