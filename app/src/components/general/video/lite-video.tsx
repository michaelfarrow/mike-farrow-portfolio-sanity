'use client';

import clsx from 'clsx';
import React, { HTMLAttributes, useEffect, useState } from 'react';

const LITE_VIDEO_DEFAULT_CONTAINER: React.ElementType = 'article';

export interface LiteVideoProps<
  T extends React.ElementType = typeof LITE_VIDEO_DEFAULT_CONTAINER,
> {
  title: string;
  aspect?: number;
  announce?: string;
  alwaysLoadIframe?: boolean;
  onIframeAdded?: () => void;
  containerElement?: T;
  containerAttrs?: Partial<HTMLAttributes<T>>;
  children: React.ReactNode;
  preconnect: React.ReactNode;
  poster: React.ReactNode;
}

export type LiteVideoExtendsProps = Omit<
  LiteVideoProps,
  'preconnect' | 'children'
>;

export function LiteVideo<T extends React.ElementType>({
  title,
  aspect = 16 / 9,
  announce = 'Watch',
  alwaysLoadIframe,
  onIframeAdded,
  containerAttrs,
  containerElement,
  children,
  preconnect,
  poster,
}: LiteVideoProps<T>) {
  const [preconnected, setPreconnected] = useState(false);
  const [iframe, setIframe] = useState(Boolean(alwaysLoadIframe));

  const Container = containerElement || LITE_VIDEO_DEFAULT_CONTAINER;

  const warmConnections = () => {
    if (preconnected) return;
    setPreconnected(true);
  };

  const addIframe = () => {
    if (iframe) return;
    setIframe(true);
  };

  useEffect(() => {
    if (iframe && onIframeAdded) {
      onIframeAdded();
    }
  }, [iframe, onIframeAdded]);

  return (
    <>
      <>{preconnected && preconnect}</>
      <Container
        {...containerAttrs}
        className={clsx([
          'relative overflow-hidden bg-black',
          containerAttrs && containerAttrs.className,
        ])}
        style={{
          ...containerAttrs?.style,
          ...{ paddingTop: `${100 / aspect}%` },
        }}
        onPointerOver={warmConnections}
        onClick={addIframe}
      >
        <span className='absolute inset-0 block h-full w-full *:absolute *:inset-0 *:h-full *:w-full'>
          {(iframe && children) || (
            <button
              type='button'
              className='invisible'
              aria-label={`${announce} ${title}`}
            />
          )}
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 block h-full w-full transition-opacity duration-500 *:absolute *:inset-0 *:!h-full *:!w-full',
              iframe && 'opacity-0'
            )}
          >
            {poster}
          </div>
        </span>
      </Container>
    </>
  );
}
