import { Captioned, CaptionedProps } from '@app/components/content/captioned';
import {
  SanityPicture,
  SanityPictureProps,
} from '@app/components/sanity/picture';

export interface ContentPictureProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityPictureProps, 'image'> {
  sizes?: string;
}

export function ContentPicture({ image, sizes, ...rest }: ContentPictureProps) {
  return (
    <Captioned {...rest} caption={image.main?.caption}>
      <SanityPicture image={image} sizes={sizes} />
    </Captioned>
  );
}
