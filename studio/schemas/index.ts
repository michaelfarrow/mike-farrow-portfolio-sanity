import { album } from '@studio/schemas/album';
import { category } from '@studio/schemas/category';
import { common } from '@studio/schemas/common';
import { contact } from '@studio/schemas/contact';
import { education } from '@studio/schemas/education';
import { experience } from '@studio/schemas/experience';
import { link } from '@studio/schemas/link';
import { project } from '@studio/schemas/project';
import { settings } from '@studio/schemas/settings';
import { skill } from '@studio/schemas/skill';

export const schemas = [
  settings,
  common,
  album,
  category,
  contact,
  education,
  experience,
  link,
  project,
  skill,
];

export type Schemas = (typeof schemas)[number];
export type SchemaType = Schemas['name'];
