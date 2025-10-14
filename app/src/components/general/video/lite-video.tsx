'use client';

import clsx from 'clsx';
import React, { HTMLAttributes, useEffect, useState } from 'react';

import { styleWithVars } from '@app/lib/style';

import styles from './lite-video.module.scss';

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
  aspect,
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
        style={styleWithVars(
          (containerAttrs && containerAttrs.style) || {},
          aspect
            ? {
                '--video-aspect': aspect,
              }
            : {}
        )}
        className={clsx([
          styles.video,
          containerAttrs && containerAttrs.className,
          iframe && styles.iframeLoaded,
        ])}
        onPointerOver={warmConnections}
        onClick={addIframe}
      >
        <span className={styles.inner}>
          {(iframe && children) || (
            <button
              type='button'
              className={styles.button}
              aria-label={`${announce} ${title}`}
            />
          )}
          <div className={styles.poster}>{poster}</div>
        </span>
      </Container>
    </>
  );
}
