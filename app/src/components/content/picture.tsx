import { BREAKPOINT_MAX, breakpointSizes } from '@app/lib/responsive';

import { Captioned, CaptionedProps } from '@app/components/content/captioned';
import {
  SanityPicture,
  SanityPictureProps,
} from '@app/components/sanity/picture';

export interface ContentPictureProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityPictureProps, 'image'> {
  half?: boolean;
}

export function ContentPicture({ image, half, ...rest }: ContentPictureProps) {
  return (
    <Captioned {...rest} caption={image.main?.caption}>
      <SanityPicture
        image={image}
        sizes={breakpointSizes({
          breakpoints: { mobile: '100vw', desktop: half ? '50vw' : '100vw' },
          max: BREAKPOINT_MAX / (half ? 2 : 1),
        })}
      />
    </Captioned>
  );
}
