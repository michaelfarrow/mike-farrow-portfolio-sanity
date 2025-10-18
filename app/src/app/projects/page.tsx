import Link from 'next/link';

import { resolve } from '@studio/presentation/resolve';

import { hasSlug } from '@app/lib/document';
import { createPage } from '@app/lib/page';
import { getProjects } from '@app/lib/sanity/queries/project';
import { Container } from '@app/components/page/container';

const projects = createPage('projects', getProjects, {
  metadata: () => ({
    title: `Projects`,
  }),
  render: (projects) => {
    return (
      <Container>
        <ul>
          {projects.map((project) => {
            if (!hasSlug(project)) return null;
            return (
              <li key={project._id}>
                <Link href={resolve.project.detail(project)}>
                  {project.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    );
  },
});

export const { generateMetadata } = projects;
export default projects.page;
