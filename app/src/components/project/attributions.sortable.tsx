'use client';

import { stegaClean } from 'next-sanity';
import React from 'react';

import { useStegaValue } from '@app/hooks/stega';
import type { getProject } from '@app/lib//sanity/queries/project';
import { memo } from '@app/lib/react';
import { MaybeLink } from '@app/components/content/maybe-link';
import { Sortable, SortableChild } from '@app/components/sanity/sortable';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
type Attribution = NonNullable<Project['attributions']>[number];

const ProjectAttribution = memo(
  function ProjectAttribution({
    attribution,
    SortableChild,
    ...rest
  }: React.ComponentPropsWithoutRef<'div'> & {
    attribution: Attribution;
    SortableChild: SortableChild;
  }) {
    const _attribution = useStegaValue(attribution);
    return (
      <div {...rest}>
        <h3>{_attribution.name}</h3>
        <ul>
          <SortableChild
            of={_attribution}
            path='contacts'
            items={_attribution.contacts}
          >
            {({ items, props }) => {
              return items.map((contact) => {
                const { key, ...rest } = props(contact);
                return (
                  <li key={key} {...rest}>
                    <MaybeLink {...contact.link} target='_blank'>
                      {stegaClean(contact.name)}
                    </MaybeLink>
                  </li>
                );
              });
            }}
          </SortableChild>
        </ul>
      </div>
    );
  },
  {
    deep: true,
    ignoreFunctions: true,
  }
);

export const ProjectAttributions = memo(
  function ProjectAttributions({ project }: { project: Project }) {
    return (
      <Sortable
        document={project}
        path='attributions'
        getItems={(project) => project.attributions}
      >
        {({ items, props, SortableChild }) =>
          items.map((attr) => {
            const { key, ...rest } = props(attr);
            return (
              <ProjectAttribution
                key={key}
                attribution={attr}
                SortableChild={SortableChild}
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
