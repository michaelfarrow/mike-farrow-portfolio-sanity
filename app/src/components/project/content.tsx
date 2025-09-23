'use client';

import clsx from 'clsx';
import { stegaClean } from 'next-sanity';

import { getProject } from '@app/lib//sanity/queries/project';
import { memo } from '@app/lib/react';
import { BREAKPOINT_MAX, breakpointSizes } from '@app/lib/responsive';

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
import { Sortable, SortableChild } from '@app/components/sanity/sortable';

import styles from './content.module.css';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
type Content = NonNullable<Project['content']>;
type ContentItem = Content[number];

const ProjectContentItem = memo(
  function ProjectContentItem({
    block,
    SortableChild,
    className,
    full,
    ...rest
  }: React.ComponentPropsWithoutRef<'div'> & {
    block: ContentItem;
    SortableChild: SortableChild;
    full: boolean;
  }) {
    const sizes = breakpointSizes(
      { max: 'mobile', size: '100vw' },
      { max: 'desktop', size: full ? '100vw' : '50vw' },
      BREAKPOINT_MAX / (full ? 1 : 2)
    );

    return (
      <div {...rest} className={clsx(className, styles.handle)}>
        <SortableChild of={block} path='content' items={block.content}>
          {({ items, props }) => (
            <Array
              value={items}
              wrapper={(child, children) => {
                const { key, ...rest } = props(child);
                return (
                  <div key={key} {...rest}>
                    {children}
                  </div>
                );
              }}
              components={{
                code: (block) =>
                  cc(block.code?.length, <ContentCode code={block} />),
                md: (block) =>
                  cc(block.content?.length, <Markdown value={block.content} />),
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
                  cc(block.url, <ContentVideo video={block} sizes={sizes} />),
                quote: (block) =>
                  cc(
                    block.quote || block.attribution,
                    <ContentQuote quote={block} />
                  ),
              }}
            />
          )}
        </SortableChild>
      </div>
    );
  },
  {
    deep: true,
    ignoreFunctions: true,
  }
);

export const ProjectContent = memo(
  function ProjectContent({
    project,
  }: {
    project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
  }) {
    if (!project.content) return null;

    return (
      <Sortable
        document={project}
        path='content'
        getItems={(project) => project.content}
        className={styles.grid}
      >
        {({ items, props, SortableChild }) =>
          items.map((item) => {
            const { key, ...rest } = props(item);
            return (
              <ProjectContentItem
                key={key}
                className={clsx(
                  styles.gridItem,
                  stegaClean(item.span) === 'full' && styles.gridItemFull
                )}
                block={item}
                SortableChild={SortableChild}
                data-sanity-drag-flow='horizontal'
                full={stegaClean(item.span) === 'full'}
                // data-sanity-drag-flow={
                //   stegaClean(item.span) === 'full ? 'horizontal' : 'vertical'
                // }
                {...rest}
              />
            );
          })
        }
      </Sortable>
    );
  },
  { deep: true }
);
