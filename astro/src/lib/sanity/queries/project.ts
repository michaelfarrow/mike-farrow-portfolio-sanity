import { defineQuery } from 'groq';

import { arrayCommonQuery } from '@astro/lib/sanity/queries/array';
import {
  imageQuery,
  responsiveImageQuery,
} from '@astro/lib/sanity/queries/common/image';
import { videoQuery } from '@astro/lib/sanity/queries/common/video';
import { createQuery } from '@astro/lib/sanity/query';

export const projectsQuery = defineQuery(`
  *[_type == "project"] {
    _id,
    slug,
    name,
    description
  }
`);

export const projectContentQuery = `
  ${arrayCommonQuery},
  _type == "image" => ${imageQuery},
  _type == "responsiveImage" => ${responsiveImageQuery},
  _type == "video" => ${videoQuery},
  _type == "richText" => {
    ...
  },
  _type == "md" => {
    ...
  },
  _type == "temp" => {
    names[] {
      ...
    }
  }
`;

export const projectQuery = defineQuery(`
  *[
    _type == "project" &&
    slug.current == $slug
  ][0] {
    _id,
    _type,
    name,
    description,
    descriptionLong,
    thumbnail ${imageQuery},
    content[] {
      ${arrayCommonQuery},
      span,
      content[] {
        ${projectContentQuery}
      },
    },
    attributions[] {
      _key,
      name,
      contacts[]{
        _key,
        ...(@->{
          _id,
          name
        })
      }
    },
    private,
    hideFromSearchEngines
  }
`);

export const getProjects = createQuery(projectsQuery);
export const getProject = createQuery(projectQuery).withParams<{
  slug: string;
}>;
