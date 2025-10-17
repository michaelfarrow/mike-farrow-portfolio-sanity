import {
  LiteVideo,
  LiteVideoExtendsProps,
} from '@app/components/general/video/lite-video';

export interface NativeVideoProps extends LiteVideoExtendsProps {
  src: string;
}

export function NativeVideo({ src, title, ...rest }: NativeVideoProps) {
  const srcUrl = new URL(src);

  return (
    <LiteVideo
      {...rest}
      title={title}
      preconnect={
        <>
          <link rel='preconnect' href={srcUrl.origin} />
        </>
      }
    >
      <video className='object-cover' src={src} autoPlay controls />
    </LiteVideo>
  );
}
