import { defineQuery } from 'groq';

import { linkQuery } from '@app/lib/sanity/queries/common/link';
import { createQuery } from '@app/lib/sanity/query';

export const experienceQuery = defineQuery(`
  *[_type == "experience"] | order(from desc) {
    _id,
    title,
    employer-> {
      _id,
      name,
      link-> ${linkQuery}
    },
    description,
    from,
    to,
  }
`);

export const educationQuery = defineQuery(`
  *[_type == "education"] | order(from desc) {
    _id,
    qualification,
    institution-> {
      _id,
      name,
      link-> ${linkQuery}
    },
    from,
    to,
  }
`);

export const skillsQuery = defineQuery(`
  *[_type == "skill" && root] | order(name asc) {
    _id,
    name,
    subSkills[]->{
      _id,
      name,
      subSkills[]->{
        _id,
        name
      }
    }
  }
`);

export const cvQuery = defineQuery(`{
  'experience': ${experienceQuery},
  'education': ${educationQuery},
  'skills': ${skillsQuery}
}`);

export const getExperience = createQuery(experienceQuery);
export const getEducation = createQuery(educationQuery);
export const getSkills = createQuery(skillsQuery);

export const getCV = createQuery(cvQuery);
