import { Captioned, CaptionedProps } from '@app/components/content/captioned';
import { SanityVideo, SanityVideoProps } from '@app/components/sanity/video';

export interface ContentVideoProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityVideoProps, 'video'> {}

export function ContentVideo({ video, ...rest }: ContentVideoProps) {
  return (
    <Captioned {...rest} caption={video.caption}>
      <SanityVideo video={video} />
    </Captioned>
  );
}
