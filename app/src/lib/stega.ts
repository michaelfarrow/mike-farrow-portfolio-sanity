import { vercelStegaDecode, vercelStegaSplit } from '@vercel/stega';
import { mapValues } from 'lodash-es';
import { stegaClean } from 'next-sanity';

import { config } from '@app/lib/config';

export { stegaClean } from 'next-sanity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processObject = (o?: any): any => {
  if (!o) return o;
  if (typeof o === 'string') return stegaClean(o);
  if (Array.isArray(o)) return o.map(processObject);
  if (typeof o === 'object') {
    return mapValues(o, processObject);
  }
  return o;
};

export function stegaValueDecode(o?: string) {
  if (!o) return undefined;
  const decoded: { href?: string } | undefined = vercelStegaDecode(o);
  return decoded?.href
    ?.split(/;/g)
    .slice(1)
    .join(';')
    .replace(
      /\?baseUrl=.*?$/,
      `;base=${encodeURIComponent(config.url.studio || '/')}`
    );
}

export function stegaValueSplit(o?: string) {
  if (!o) return undefined;
  const split = vercelStegaSplit(o);
  return { ...split, encoded: split.encoded };
}

export function stegaCleanObject<T>(o: T): T {
  if (o === undefined) return o;
  return processObject(o);
}
