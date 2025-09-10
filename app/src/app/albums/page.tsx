import Link from 'next/link';

import { resolve } from '@studio/presentation/resolve';

import { hasSlug } from '@app/lib/document';
import { createPage } from '@app/lib/page';
import { getAlbums } from '@app/lib/sanity/queries/album';

const albums = createPage('albums', getAlbums, {
  metadata: () => ({
    title: 'Albums',
  }),
  render: (albums) => {
    return (
      <div>
        <ul>
          {albums.map((album) => {
            if (!hasSlug(album)) return null;
            return (
              <li key={album._id}>
                <Link href={resolve.album(album)}>{album.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});

export const { generateMetadata } = albums;
export default albums.page;
