import { capitalCase } from 'change-case';
import { unflatten } from 'flat';
import { mapKeys } from 'lodash';
import { titleCase } from 'title-case';

import { resolve as pathResolve, PathResolver } from './resolve';

export type TypeResolver = ReturnType<ReturnType<typeof createTypeResolver>>;

function createTypeResolver<PR extends PathResolver>(pathResolve: PR) {
  type PT = Parameters<PR>[0];

  const create = <T extends object>({
    filter,
    locations,
  }: {
    filter: string;
    locations: (
      doc: PR extends never ? any : PT & T,
      resolvePath: PR
    ) => {
      title: string;
      href: string;
    }[];
  }) => {
    return {
      locations: (doc: PR extends never ? any : PT & T) => {
        const items = locations(doc, pathResolve);
        if (!items.length) return null;
        return items;
      },
      document: {
        route: pathResolve.path
          .replace(/\[(.*?)\]/g, ':$1')
          .replace(/\./g, '__'),
        resolve(ctx: any) {
          console.log(ctx);
          const { params } = ctx;
          const mapped: any = unflatten(
            mapKeys(params, (_val, key) => key.replace(/__/g, '.'))
          );
          return {
            filter,
            params: mapped,
          };
        },
      },
    };
  };

  return create;
}

function createSlugTypeResolver<PR extends PathResolver, T extends string>(
  pathResolve: PR,
  type: T,
  index?: string
) {
  return createTypeResolver(pathResolve)<{ name?: string }>({
    filter: `_type == "${type}" && slug.current == $slug.current`,
    locations: (doc, resolvePath) => {
      return (
        (doc?.slug && [
          {
            title: doc?.name || doc?.title || 'Untitled',
            href: resolvePath(doc),
          },
          ...(index !== undefined
            ? [
                {
                  title: `${titleCase(capitalCase(type))} index`,
                  href: `/${index}`,
                },
              ]
            : []),
        ]) ||
        []
      );
    },
  });
}

export const resolve = {
  project: createSlugTypeResolver(pathResolve.project, 'project', ''),
  album: createSlugTypeResolver(pathResolve.album, 'album', 'albums'),
};
