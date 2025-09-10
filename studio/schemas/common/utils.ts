import type { defineArrayMember, defineField } from 'sanity';

export function conditionalField<
  T extends ReturnType<typeof defineField | typeof defineArrayMember>,
  F extends () => T | T[],
>(condition: boolean | undefined, field: F) {
  return condition !== false ? field() : undefined;
}

export function conditionalFields(
  ...fields: ReturnType<typeof conditionalField>[]
) {
  return fields.filter((f) => !!f).flat();
}
