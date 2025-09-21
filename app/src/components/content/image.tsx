import { BREAKPOINT_MAX, breakpointSizes } from '@app/lib/responsive';

import { Captioned, CaptionedProps } from '@app/components/content/captioned';
import { SanityImage, SanityImageProps } from '@app/components/sanity/image';

export interface ContentImageProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityImageProps, 'image'> {
  half?: boolean;
}

export function ContentImage({ image, half, ...rest }: ContentImageProps) {
  return (
    <Captioned {...rest} caption={image.caption}>
      <SanityImage
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
