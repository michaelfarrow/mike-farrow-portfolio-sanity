import { defineQuery } from 'groq';

import { createQuery } from '@app/lib/sanity/query';

export const settingsQuery = defineQuery(`
  *[
    _type == "settings" && _id == "settings"
  ][0] {
    password
  }
`);

export const getSettings = createQuery(settingsQuery);
