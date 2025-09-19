import { DateDefinition, FieldDefinitionBase, defineField } from 'sanity';

export function dateField(
  options: Omit<DateDefinition, 'type'> & FieldDefinitionBase
) {
  const { ...rest } = options;

  return defineField({
    ...rest,
    type: 'date',
    options: {
      dateFormat: 'DD/MM/YYYY',
    },
  });
}
