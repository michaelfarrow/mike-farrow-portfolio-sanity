import { capitalCase } from 'change-case';
import { isValidElementType } from 'react-is';

import { DocumentIcon } from '@sanity/icons';
import { Badge, Flex } from '@sanity/ui';
import { PreviewProps } from 'sanity';

export const DocumentPreview = (props: PreviewProps) => {
  const { renderDefault, schemaType } = props;

  const Icon = schemaType?.icon;
  const type =
    schemaType?.title || (schemaType?.name && capitalCase(schemaType?.name));

  return renderDefault({
    ...props,
    status:
      (type && (
        <Badge padding={2}>
          <Flex>
            <span style={{ paddingRight: 7, transform: 'scale(0.90)' }}>
              {(isValidElementType(Icon) && <Icon />) || <DocumentIcon />}
            </span>
            {type}
          </Flex>
        </Badge>
      )) ||
      undefined,
  });
};
