import clsx from 'clsx';
import { Refractor, registerLanguage } from 'react-refractor';
import arduino from 'refractor/arduino';
import bash from 'refractor/bash';
import css from 'refractor/css';
import js from 'refractor/jsx';
import html from 'refractor/markup';
import shell from 'refractor/shell-session';
import ts from 'refractor/tsx';

import type { CommonSchemaType } from '@app/types/content';

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

export type SanityCode = CommonSchemaType<'code'>;

export interface SanityCodeProps extends React.ComponentPropsWithoutRef<'div'> {
  code: SanityCode;
}

export function SanityCode({
  code: { code, filename, language = 'typescript', highlightedLines },
  className,
  ...rest
}: SanityCodeProps) {
  if (!code) return null;
  return (
    <div {...rest} className={clsx(className)}>
      {(filename && <p>{filename}</p>) || null}
      <Refractor
        language={MAP[language] || language}
        value={code}
        markers={highlightedLines}
      />
    </div>
  );
}
