import {
  createPathResolver,
  createStaticResolver,
  ResolveConfig,
} from '@studio/presentation/resolver';

const cvResolver = createStaticResolver('/cv', 'CV');

export const resolve = {
  project: {
    index: createStaticResolver('/projects'),
    detail: createPathResolver('/projects/[slug.current]'),
  },
  album: {
    index: createStaticResolver('/albums'),
    detail: createPathResolver('/albums/[slug.current]'),
  },
  cv: cvResolver,
  skill: cvResolver,
  experience: cvResolver,
  education: cvResolver,
} satisfies ResolveConfig;
