import { Captioned, CaptionedProps } from '@app/components/content/captioned';
import { SanityImage, SanityImageProps } from '@app/components/sanity/image';

export interface ContentImageProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityImageProps, 'image'> {
  sizes?: string;
}

export function ContentImage({ image, sizes, ...rest }: ContentImageProps) {
  return (
    <Captioned {...rest} caption={image.caption}>
      <SanityImage image={image} sizes={sizes} />
    </Captioned>
  );
}
