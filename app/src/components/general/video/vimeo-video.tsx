import {
  LiteVideo,
  LiteVideoExtendsProps,
} from '@app/components/general/video/lite-video';

export interface VimeoVideoProps extends LiteVideoExtendsProps {
  id: string;
  cookie?: boolean;
}

export function VimeoVideo({ id, title, cookie, ...rest }: VimeoVideoProps) {
  const videoId = encodeURIComponent(id);

  const iframeParams = new URLSearchParams({
    dnt: cookie ? '0' : '1',
    autoplay: '1',
    transparent: '0',
  });

  const vimeoUrl = 'https://player.vimeo.com';

  const iframeSrc = `${vimeoUrl}/video/${videoId}?${iframeParams.toString()}`;

  return (
    <LiteVideo
      {...rest}
      title={title}
      preconnect={
        <>
          {/* The iframe document and most of its subresources come right off player.vimeo.com */}
          <link rel='preconnect' href='https://player.vimeo.com' />
          {/* Images */}
          <link rel='preconnect' href='https://i.vimeocdn.com' />
          {/* Files .js, .css */}
          <link rel='preconnect' href='https://f.vimeocdn.com' />
          {/* Metrics */}
          <link rel='preconnect' href='https://fresnel.vimeocdn.com' />
        </>
      }
    >
      <iframe
        src={iframeSrc}
        title={title}
        frameBorder='0'
        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe>
    </LiteVideo>
  );
}
