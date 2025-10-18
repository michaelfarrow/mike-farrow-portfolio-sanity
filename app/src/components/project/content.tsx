import clsx from 'clsx';
import { stegaClean } from 'next-sanity';

import { getProject } from '@app/lib//sanity/queries/project';
import { BREAKPOINTS_MIN, breakpointSizes } from '@app/lib/responsive';
import { ContentCode } from '@app/components/content/code';
import { ContentImage } from '@app/components/content/image';
import { Markdown } from '@app/components/content/markdown';
import { ContentPicture } from '@app/components/content/picture';
import { ContentQuote } from '@app/components/content/quote';
import { ContentVideo } from '@app/components/content/video';
import {
  Array,
  conditionalComponent as cc,
} from '@app/components/sanity/array';

const CONTAINER_MAX = BREAKPOINTS_MIN['2xl'].width;

export function ProjectContent({
  project,
}: {
  project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
}) {
  if (!project.content) return null;

  return (
    <div className='grid grid-cols-2 gap-10'>
      {project.content.map((item) => {
        const full = stegaClean(item.span) === 'full';

        const sizes = breakpointSizes(
          { min: CONTAINER_MAX, size: CONTAINER_MAX / (full ? 1 : 2) },
          { min: 'md', size: full ? '100vw' : '50vw' },
          '100vw'
        );

        return (
          <div
            key={item._key}
            className={clsx('col-span-full', !full && 'md:col-auto')}
          >
            <div className='sticky top-0 [.draft-mode_&]:static'>
              <Array
                value={item.content || []}
                wrapper={(child, children) => {
                  return <div key={child._key}>{children}</div>;
                }}
                components={{
                  code: (block) =>
                    cc(block.code?.length, <ContentCode code={block} />),
                  md: (block) =>
                    cc(
                      block.content?.length,
                      <Markdown value={block.content} />
                    ),
                  responsiveImage: (block) =>
                    cc(
                      block.main?.asset?.url,
                      <ContentPicture image={block} sizes={sizes} />
                    ),
                  image: (block) =>
                    cc(
                      block.asset?.url,
                      <ContentImage image={block} sizes={sizes} />
                    ),
                  video: (block) =>
                    cc(
                      block.file,
                      <ContentVideo video={block} sizes={sizes} />
                    ),
                  remoteVideo: (block) =>
                    cc(block.url, <ContentVideo video={block} sizes={sizes} />),
                  quote: (block) =>
                    cc(
                      block.quote || block.attribution,
                      <ContentQuote quote={block} />
                    ),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
