import { Captioned, CaptionedProps } from '@app/components/content/captioned';
import { SanityVideo, SanityVideoProps } from '@app/components/sanity/video';

export interface ContentVideoProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityVideoProps, 'video'> {
  sizes?: string;
}

export function ContentVideo({ video, sizes, ...rest }: ContentVideoProps) {
  return (
    <Captioned {...rest} caption={video.caption}>
      <SanityVideo video={video} sizes={sizes} native />
    </Captioned>
  );
}
