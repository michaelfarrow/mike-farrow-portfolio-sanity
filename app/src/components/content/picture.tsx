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
        sizes={breakpointSizes(
          { max: 'mobile', size: '100vw' },
          { max: 'desktop', size: half ? '50vw' : '100vw' },
          BREAKPOINT_MAX / (half ? 2 : 1)
        )}
      />
    </Captioned>
  );
}
