import { stegaClean } from 'next-sanity';
import ReactMarkdown from 'react-markdown';

import { stegaValueDecode } from '@app/lib/stega';

export function Markdown({ value }: { value?: string }) {
  const stegaDecoded = stegaValueDecode(value);
  return (
    <div data-sanity={stegaDecoded || undefined}>
      <ReactMarkdown>{stegaClean(value)}</ReactMarkdown>
    </div>
  );
}
