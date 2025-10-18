import { capitalCase } from 'change-case';
import { unflatten } from 'flat';
import { mapKeys } from 'lodash-es';
import { titleCase } from 'title-case';
import { SetOptional } from 'type-fest';

import { resolve } from './resolve';
import { Path, PathResolver } from './resolver';

export type TypeResolver = ReturnType<ReturnType<typeof createTypeResolver>>;

function createTypeResolver<PR extends PathResolver<any>>(pathResolve: PR) {
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

function createSlugTypeResolver<
  PR extends PathResolver<{
    slug: {
      current: string;
    };
  }>,
>(pathResolve: PR, type: string, index: Path) {
  return createTypeResolver(pathResolve)<{ name?: string; title?: string }>({
    filter: `_type == "${type}" && slug.current == $slug.current`,
    locations: (doc, resolvePath) => {
      return (
        (doc?.slug && [
          {
            title: doc?.name || doc?.title || 'Untitled',
            href: resolvePath(doc),
          },
          {
            title: `${titleCase(capitalCase(index))} index`,
            href: `${index}`,
          },
        ]) ||
        []
      );
    },
  });
}

const resolveStudio: Record<string, SetOptional<TypeResolver, 'document'>> = {};

for (const [type, pathsOrPath] of Object.entries(resolve)) {
  if ('detail' in pathsOrPath) {
    const paths = pathsOrPath;
    resolveStudio[type] = createSlugTypeResolver(
      paths.detail,
      type,
      paths.index()
    );
  }

  if (typeof pathsOrPath === 'function') {
    const path = pathsOrPath;
    resolveStudio[type] = {
      locations: () => [{ href: path(), title: path.title || 'Unknown' }],
    };
  }
}

export { resolveStudio };
