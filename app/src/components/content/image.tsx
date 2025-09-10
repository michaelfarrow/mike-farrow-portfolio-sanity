import { breakpointSizes } from '@app/lib/responsive';

import { Captioned, CaptionedProps } from '@app/components/content/captioned';
import { SanityImage, SanityImageProps } from '@app/components/sanity/image';

export interface ContentImageProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityImageProps, 'image'> {}

export function ContentImage({ image, ...rest }: ContentImageProps) {
  return (
    <Captioned {...rest} caption={image.caption}>
      <SanityImage image={image} sizes={breakpointSizes({ max: true })} />
    </Captioned>
  );
}
