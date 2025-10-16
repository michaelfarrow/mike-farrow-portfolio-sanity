import { uniqBy } from 'lodash-es';
import { map, Observable } from 'rxjs';

import { type ClientReturn } from '@sanity/client';
import { getDraftId } from 'sanity';
import { DocumentLocationResolver } from 'sanity/presentation';

import { resolveDynamicQuery } from '@studio/lib/queries/resolve-dynamic';
import { TypeResolver } from '@studio/presentation/resolve-studio';
import { SchemaType } from '@studio/schemas';

export function resolveDynamic(
  resolve: { [key in SchemaType]?: TypeResolver },
  config?: {
    [key in SchemaType]?: { deep?: boolean };
  }
): DocumentLocationResolver {
  return (params, context) => {
    const { id, type } = params;

    const resolver = resolve?.[type as keyof typeof resolve];

    const typeConfig = config?.[type as keyof typeof config];

    const query = {
      fetch: resolveDynamicQuery,
      listen: `*[_id in [$id,$draftId]]`,
    };

    const doc$ = context.documentStore.listenQuery(
      query,
      { id, draftId: getDraftId(id), deep: Boolean(typeConfig?.deep) },
      { perspective: 'drafts' }
    ) as Observable<ClientReturn<typeof resolveDynamicQuery>>;

    return doc$.pipe(
      map((res) => {
        const mainLocations =
          (res.document?.slug?.current && resolver?.locations(res.document)) ||
          [];

        const refs = [...res.directRefs, ...res.indirectRefs];

        const references = uniqBy(refs, (ref) => ref._id)
          .map((doc: any) => {
            const resolver: (typeof resolve)[keyof typeof resolve] =
              resolve[doc._type as keyof typeof resolve];

            if (!resolver) return null;

            return resolver.locations(doc)?.[0] || null;
          })
          .filter((item) => !!item);

        const locations = uniqBy(
          [...mainLocations, ...references],
          (location) => location.href
        );

        if (!locations.length) return null;

        return {
          locations,
        };
      })
    );
  };
}
