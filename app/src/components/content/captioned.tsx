'use client';

import { useStegaValue } from '@app/hooks/stega';

import { Figure } from '@app/components/general/figure';

export interface CaptionedProps extends React.ComponentPropsWithoutRef<'div'> {
  caption?: string;
}

export function Captioned({ caption, children, ...rest }: CaptionedProps) {
  const _caption = useStegaValue(caption);

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
