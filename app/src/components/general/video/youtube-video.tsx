import {
  LiteVideo,
  LiteVideoExtendsProps,
} from '@app/components/general/video/lite-video';

export interface YoutubeVideoProps extends LiteVideoExtendsProps {
  id: string;
  cookie?: boolean;
  adNetwork?: boolean;
}

export function YoutubeVideo({
  id,
  title,
  cookie,
  adNetwork,
  ...rest
}: YoutubeVideoProps) {
  const videoId = encodeURIComponent(id);

  const iframeParams = new URLSearchParams({
    autoplay: '1',
  });

  const ytUrl = cookie
    ? 'https://www.youtube.com'
    : 'https://www.youtube-nocookie.com';

  const iframeSrc = `${ytUrl}/embed/${videoId}?${iframeParams.toString()}`;

  return (
    <LiteVideo
      {...rest}
      title={title}
      preconnect={
        <>
          <link rel='preconnect' href={ytUrl} />
          <link rel='preconnect' href='https://www.google.com' />
          {adNetwork && (
            <>
              <link rel='preconnect' href='https://static.doubleclick.net' />
              <link
                rel='preconnect'
                href='https://googleads.g.doubleclick.net'
              />
            </>
          )}
        </>
      }
    >
      <iframe
        {...rest}
        src={iframeSrc}
        title={title}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      ></iframe>
    </LiteVideo>
  );
}
