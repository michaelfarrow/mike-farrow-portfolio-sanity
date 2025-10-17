import React from 'react';

import { stegaCleanObject } from '@app/lib/stega';
import { Figure } from '@app/components/general/figure';

export interface CaptionedProps extends React.ComponentPropsWithoutRef<'div'> {
  caption?: string;
}

export function Captioned({ caption, children, ...rest }: CaptionedProps) {
  const _caption = stegaCleanObject(caption);

  return (
    <div {...rest}>
      {caption ? (
        <Figure {...rest} caption={_caption}>
          {children}
        </Figure>
      ) : (
        children
      )}
    </div>
  );
}
