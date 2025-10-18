import { getExifData } from '@app/lib/image';
import { createPage } from '@app/lib/page';
import { getAlbum, getAlbums } from '@app/lib/sanity/queries/album';
import { ContentImage } from '@app/components/content/image';
import { Container } from '@app/components/page/container';

const album = createPage('album', getAlbum, {
  params: async () => {
    return (await getAlbums())
      .map(({ slug }) => slug?.current)
      .filter((slug): slug is string => !!slug)
      .map((slug) => ({
        slug,
      }));
  },
  metadata: ({ name }) => ({
    title: name,
  }),
  render: ({ name, photos }) => {
    return (
      <Container>
        <h1>{name}</h1>
        <ul>
          {photos?.map((photo) => {
            const exif = getExifData(photo);
            const settings =
              exif?.settings && Object.values(exif.settings).filter((v) => !!v);

            return (
              <li key={photo._key}>
                <ContentImage image={photo} />
                {null}
                {(settings && <div>{settings.join(', ')}</div>) || undefined}
              </li>
            );
          })}
        </ul>
      </Container>
    );
  },
});

export const { generateMetadata, generateStaticParams } = album;
export default album.page;
