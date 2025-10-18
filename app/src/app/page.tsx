import { createPage } from '@app/lib/page';
import { getProjects } from '@app/lib/sanity/queries/project';

const projects = createPage('home', getProjects, {
  metadata: () => ({
    title: `Home`,
  }),
  render: () => {
    return <div></div>;
  },
});

export const { generateMetadata } = projects;
export default projects.page;
