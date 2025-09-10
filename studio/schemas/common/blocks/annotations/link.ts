import { LinkIcon } from '@sanity/icons';
import { defineField } from 'sanity';

export const externalLinkAnnotation = defineField({
  type: 'object',
  name: 'link',
  icon: LinkIcon,
  options: {
    modal: { type: 'popover' },
  },
  fields: [
    {
      name: 'href',
      type: 'url',
      title: 'Link',
      description: 'A valid web, email, phone, or relative link.',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https', 'tel', 'mailto'],
          allowRelative: true,
        }),
    },
  ],
});

export const internalLinkAnnotation = defineField({
  type: 'object',
  name: 'internalLink',
  title: 'Internal Link',
  icon: LinkIcon,
  options: {
    modal: { type: 'popover' },
  },
  fields: [
    {
      name: 'reference',
      type: 'reference',
      to: [{ type: 'project' }],
    },
  ],
});
