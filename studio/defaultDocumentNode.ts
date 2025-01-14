import { type DefaultDocumentNodeResolver } from 'sanity/structure';
import { Iframe } from 'sanity-plugin-iframe-pane';
import { type SanityDocument } from 'sanity';
import { config } from '@common/config';

// Customise this function to show the correct URL based on the current document
function getPreviewUrl(doc: SanityDocument) {
  const slug = doc?.slug as any | undefined;
  return slug && slug.current
    ? `${config.paths.app}/events/${slug.current}`
    : `${config.paths.app}`;
}

// Import this into the deskTool() plugin
export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  // Only show preview pane on `movie` schema type documents
  switch (schemaType) {
    case `event`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: {
              // origin: 'same-origin', // change origin as needed
              preview: (doc: SanityDocument) => getPreviewUrl(doc),
              draftMode: `${config.paths.app}/api/draft-mode/enable`,
            },
            reload: {
              button: true,
            },
            // url: (doc: SanityDocument) => getPreviewUrl(doc),
          })
          .title('Preview'),
      ]);
    default:
      return S.document().views([S.view.form()]);
  }
};
