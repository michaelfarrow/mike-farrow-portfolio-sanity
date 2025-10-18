import { PartialDeep } from 'type-fest';

import { createPage } from '@app/lib/page';
import { getCV } from '@app/lib/sanity/queries/cv';
import { MaybeLink } from '@app/components/content/maybe-link';
import { Conditional } from '@app/components/general/conditional';

type Skill = Awaited<ReturnType<typeof getCV>>['skills'][number];
type SkillFlat = Omit<Skill, 'subSkills'> & {
  subSkills?: SkillFlat[];
};

function renderSkills(skills?: PartialDeep<SkillFlat>[]) {
  return (
    (skills?.length && (
      <ul>
        {skills.map((skill, i) => (
          <li key={i}>
            {skill.name} {renderSkills(skill.subSkills)}
          </li>
        ))}
      </ul>
    )) ||
    undefined
  );
}

const cv = createPage('cv', getCV, {
  metadata: () => ({
    title: `CV`,
  }),
  render: ({ experience, education, skills }) => {
    return (
      <div>
        <section>
          <h2>Experience</h2>
          <ul>
            {experience.map((experience) => (
              <li key={experience._id}>
                <b>{experience.title}</b>
                <br />
                <MaybeLink {...experience.employer?.link} target='_blank'>
                  {experience.employer?.name}
                </MaybeLink>
                <Conditional value={experience.description}>
                  {(description) => <p>{description}</p>}
                </Conditional>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Education</h2>
          <ul>
            {education.map((education) => (
              <li key={education._id}>
                <b>{education.qualification}</b>
                <br />
                <MaybeLink {...education.institution?.link} target='_blank'>
                  {education.institution?.name}
                </MaybeLink>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Skills</h2>
          {renderSkills(skills)}
        </section>
      </div>
    );
  },
});

export const { generateMetadata } = cv;
export default cv.page;
