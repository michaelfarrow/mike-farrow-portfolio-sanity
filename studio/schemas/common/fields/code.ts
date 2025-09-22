import { CodeDefinition } from '@sanity/code-input';
import { defineField } from 'sanity';

import type { CustomFieldOptions } from '@studio/schemas/common/fields/field';

export function codeField({
  ...rest
}: CustomFieldOptions<CodeDefinition, 'options'>) {
  return defineField({
    ...rest,
    type: 'code',
    options: {
      language: 'typescript',
      languageAlternatives: [
        { title: 'Shell Session', value: 'shell-session' },
        { title: 'Bash', value: 'bash' },
        { title: 'Typescript', value: 'typescript' },
        { title: 'Javascript', value: 'javascript' },
        { title: 'HTML', value: 'html' },
        { title: 'CSS', value: 'css' },
      ],
      withFilename: true,
    },
  });
}
