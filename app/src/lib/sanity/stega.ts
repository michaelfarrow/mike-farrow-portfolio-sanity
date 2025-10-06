// import { stegaClean } from '@sanity/client/stega';
import { vercelStegaDecode } from '@vercel/stega';

// import { mapValues } from 'lodash';

import { config } from '@common/config';

export { stegaClean } from '@sanity/client/stega';

// const processObject = (o?: any): any => {
//   if (!o) return o;
//   if (typeof o === 'string') return stegaClean(o);
//   if (Array.isArray(o)) return o.map(processObject);
//   if (typeof o === 'object') {
//     return mapValues(o, processObject);
//   }
//   return o;
// };

export function decodeStegaValue(o?: string) {
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

// export function useStegaValueSplit(o?: string) {
//   const stega = useStega();
//   if (!o) return undefined;
//   const split = vercelStegaSplit(o);
//   return { ...split, encoded: stega ? split.encoded : '' };
// }

// export function useStegaValue<T>(o: T): T {
//   const stega = useStega();
//   if (o === undefined) return o;
//   return stega === false ? processObject(o) : o;
// }
