import { defineQuery } from 'groq';

const commonDocument = `
  _id,
  _type,
  slug,
  name,
  title
`;

export const resolveDynamicQuery = defineQuery(`
  {
    'document': *[_id==$id][0]{
      ${commonDocument}
    },
    'directRefs': *[references($id)] {
      ${commonDocument},
    },
    'indirectRefs': *[
      $deep &&
      references(
        *[references($id)]._id
      )
    ] {
      ${commonDocument},
    },
  }
`);
