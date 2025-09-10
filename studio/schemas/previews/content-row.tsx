import { IconColumns, IconRows } from '@studio/schemas/common/icons';
import { capitalCase } from 'change-case';

import { PreviewProps } from 'sanity';

import styles from './content-row.module.css';

export interface ContentRowPreviewProps extends PreviewProps {
  span?: string;
  content?: {
    _key: string;
    _type: string;
  }[];
}

export const ContentRowPreview = (props: ContentRowPreviewProps) => {
  const { renderDefault, title, span, content, schemaType } = props;

  const types =
    (schemaType as any)?.fields?.find((field: any) => field.name === 'content')
      ?.type?.of || [];

  const contentTypes = content?.map((item) => {
    const type = types.find((type: any) => type.name === item._type);

    const title =
      type?.title ||
      (type?.name && capitalCase(type?.name)) ||
      (item?._type && capitalCase(item?._type));

    return title;
  });

  const contentTypesStr = contentTypes?.length
    ? contentTypes?.join(', ')
    : 'No content';

  const full = span === 'full';

  return renderDefault({
    ...{ styles: { media: {} }, icon: full ? IconRows : IconColumns },
    ...{
      ...props,
      styles: { media: full ? styles.rows : styles.columns },
      icon: full ? IconRows : IconColumns,
      title: title || contentTypesStr,
      subtitle: [
        `${content?.length || 0} item${content?.length !== 1 ? 's' : ''}`,
        `${full ? 'full width' : 'half width'}${title ? ` - ${contentTypesStr}` : ''}`,
      ].join(', '),
    },
  });
};
