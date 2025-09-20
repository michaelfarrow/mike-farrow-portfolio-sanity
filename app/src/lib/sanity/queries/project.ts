import { defineQuery } from 'groq';

import { arrayCommonQuery } from '@app/lib/sanity/queries/array';
import {
  imageQuery,
  responsiveImageQuery,
} from '@app/lib/sanity/queries/common/image';
import { linkQuery } from '@app/lib/sanity/queries/common/link';
import { quoteQuery } from '@app/lib/sanity/queries/common/quote';
import { videoQuery } from '@app/lib/sanity/queries/common/video';
import { createQuery } from '@app/lib/sanity/query';

export const projectsQuery = defineQuery(`
  *[_type == "project"] | order(date desc)  {
    _id,
    slug,
    name,
    description,
    date
  }
`);

export const projectContentQuery = `
  ${arrayCommonQuery},
  _type == "image" => ${imageQuery},
  _type == "responsiveImage" => ${responsiveImageQuery},
  _type == "video" => ${videoQuery},
  _type == "quote" => ${quoteQuery},
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
          name,
          link-> ${linkQuery}
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
