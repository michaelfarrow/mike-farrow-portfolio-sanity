import Link from 'next/link';

// import { getExifData } from '@app/lib/image';
import { createPage } from '@app/lib/page';
import { getProject, getProjects } from '@app/lib/sanity/queries/project';
import { Markdown } from '@app/components/content/markdown';
// import { Figure } from '@app/components/general/figure';
import { ProjectAttributions } from '@app/components/project/attributions';
import { ProjectContent } from '@app/components/project/content';
import { SanityImage } from '@app/components/sanity/image';

const project = createPage('project', getProject, {
  // params: async () => {
  //   return (await getProjects())
  //     .map(({ slug }) => slug?.current)
  //     .filter((slug): slug is string => !!slug)
  //     .map((slug) => ({
  //       slug,
  //     }));
  // },
  metadata: ({ name, hideFromSearchEngines, private: isPrivate }) => ({
    title: name,
    robots: hideFromSearchEngines || isPrivate ? { index: false } : undefined,
  }),
  render: (project) => {
    const { name, description, descriptionLong, thumbnail } = project;

    // const exif = thumbnail ? getExifData(thumbnail) : null;
    // const settings =
    //   exif?.settings && Object.values(exif.settings).filter((v) => !!v);

    return (
      <div style={{ maxWidth: 1500, margin: 'auto' }}>
        <div>
          <Link href='/'>← Back to projects</Link>
        </div>
        <div>{name ? <h1>{name}</h1> : null}</div>
        <div>{description ? <p>{description}</p> : null}</div>
        <div>
          {descriptionLong ? <Markdown value={descriptionLong} /> : null}
        </div>
        {thumbnail ? (
          <SanityImage
            image={thumbnail}
            sizes='(max-width: 200px) 100vw, 200px'
            ratio={1}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: 200,
            }}
            loading='eager'
          />
        ) : null}
        <ProjectContent project={project} />
        <ProjectAttributions project={project} />
      </div>
    );
  },
});

// <div
//   style={{
//     width: '100%',
//     maxWidth: 200,
//     height: 'auto',
//     overflow: 'hidden',
//   }}
// >
//   <div style={{ paddingTop: '100%', position: 'relative' }}>
//     <SanityImage
//       image={thumbnail}
//       sizes='(max-width: 200px) 100vw, 200px'
//       ratio={1}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//       }}
//     />
//   </div>
// </div>
// <Figure
//   caption={
//     (exif && (
//       <>
//         {exif.camera && <div>{exif.camera}</div>}
//         {exif.lens && <div>{exif.lens}</div>}
//         {(settings && <div>{settings.join(' ')}</div>) || null}
//       </>
//     )) ||
//     null
//   }
// >
//   <SanityImage
//     image={thumbnail}
//     sizes='(max-width: 400px) 100vw, 400px'
//     style={{ width: '100%', maxWidth: 400, height: 'auto' }}
//   />
// </Figure>

export const { generateMetadata /*, generateStaticParams */ } = project;
export default project.page;
