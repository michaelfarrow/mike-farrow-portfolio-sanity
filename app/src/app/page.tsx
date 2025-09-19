import Link from 'next/link';

import { resolve } from '@studio/presentation/resolve';

import { hasSlug } from '@app/lib/document';
import { createPage } from '@app/lib/page';
import { getProject, getProjects } from '@app/lib/sanity/queries/project';

const projects = createPage('projects', getProjects, {
  metadata: () => ({
    title: `Projects`,
  }),
  render: (projects) => {
    return (
      <div>
        <ul>
          {projects.map((project) => {
            if (!hasSlug(project)) return null;
            return (
              <li key={project._id}>
                <Link href={resolve.project(project)}>{project.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});

export const { generateMetadata } = projects;
export default projects.page;
