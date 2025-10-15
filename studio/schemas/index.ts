import { defineType } from 'sanity';

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

type Schema = ReturnType<typeof defineType>;

export const schemas = [
  {
    type: 'ignore',
    schemas: [common, settings],
  },
  {
    title: 'General',
    schemas: [category, link, contact],
  },
  {
    title: 'Documents',
    schemas: [album, project],
  },
  {
    title: 'CV',
    schemas: [skill, experience, education],
  },
] satisfies {
  type?: 'ignore';
  title?: string;
  schemas: Schema | Schema[];
}[];

export const schemasFlat = Object.values(schemas).flatMap((type) =>
  [type.schemas].flat()
);

export type Schemas = (typeof schemasFlat)[number];
export type SchemaType = Schemas['name'];
