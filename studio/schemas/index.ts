import { album } from '@studio/schemas/album';
import { category } from '@studio/schemas/category';
import { common } from '@studio/schemas/common';
import { contact } from '@studio/schemas/contact';
import { link } from '@studio/schemas/link';
import { project } from '@studio/schemas/project';

export const schemas = [common, category, contact, project, link, album];

export type Schemas = (typeof schemas)[number];
export type SchemaType = Schemas['name'];
