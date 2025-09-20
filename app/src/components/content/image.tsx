import { breakpointSizes } from '@app/lib/responsive';

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
        sizes={breakpointSizes({
          breakpoints: { mobile: '100vw', tablet: half ? '50vw' : undefined },
          max: true,
        })}
      />
    </Captioned>
  );
}
