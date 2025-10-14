import {
  BaseSchemaDefinition,
  FieldDefinitionBase,
  RuleDef,
  ValidationBuilder,
} from 'sanity';

export type CustomFieldOptions<
  T extends BaseSchemaDefinition,
  K extends Exclude<keyof T, 'type'> | null = null,
  C extends object = object,
> = FieldDefinitionBase & Omit<T, K extends null ? 'type' : 'type' | K> & C;

export type ValidatorRule<V> =
  V extends ValidationBuilder<infer T extends RuleDef<any, any>> ? T : unknown;

export function extendValidation<V extends ValidationBuilder<any>>(
  validation: V | undefined,
  builder: (rule: ValidatorRule<V>) => any
) {
  return (rule: ValidatorRule<V>) => {
    const newRule = builder(rule);
    return (validation && validation(newRule)) || newRule;
  };
}
