import {
  defineLocations,
  PresentationPluginOptions,
} from 'sanity/presentation';

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    // Add more locations for other post types
    event: defineLocations({
      select: {
        name: 'name',
        slug: 'slug.current',
      },
      // resolve: () => ({
      //   locations: [{ title: 'index', href: '' }],
      // }),
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.name || 'Untitled',
            href: `/events/${doc?.slug}`,
          },
          { title: 'Events index', href: `/` },
        ],
      }),
    }),
  },
};
