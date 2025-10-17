import { vercelStegaDecode, vercelStegaSplit } from '@vercel/stega';
import { mapValues } from 'lodash-es';
import { stegaClean } from 'next-sanity';

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

export function stegaValueDecode(
  o?: string,
  {
    popPath,
    replacePath,
    pathParts,
  }: { popPath?: boolean; replacePath?: string; pathParts?: number } = {}
) {
  if (!o) return undefined;
  const decoded: { href?: string } | undefined = vercelStegaDecode(o);

  if (!decoded || !decoded.href) return undefined;

  const url = new URL(decoded.href);
  url.searchParams.set('base', url.searchParams.get('baseUrl') || '');
  url.searchParams.delete('perspective');
  url.searchParams.delete('baseUrl');

  if (popPath || replacePath) {
    url.searchParams.set(
      'path',
      (url.searchParams.get('path') || '').replace(
        new RegExp(`(\.[^\.]+){${pathParts || 1}}$`),
        replacePath ? `.${replacePath}` : ''
      )
    );
  }

  return url.searchParams
    .entries()
    .toArray()
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join(';');
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
