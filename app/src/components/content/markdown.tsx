import { stegaClean } from 'next-sanity';
import ReactMarkdown from 'react-markdown';

import { stegaValueDecode } from '@app/lib/stega';

export function Markdown({ value }: { value?: string }) {
  return (
    <div data-sanity={stegaValueDecode(value)}>
      <ReactMarkdown>{stegaClean(value)}</ReactMarkdown>
    </div>
  );
}
