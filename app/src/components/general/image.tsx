'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { default as NextImage, ImageProps as NextImageProps } from 'next/image';

import { useIsMaybePresentation } from '@app/hooks/sanity';
import { useTimeout } from '@app/hooks/timeout';
import { BREAKPOINTS_MIN } from '@app/lib/responsive';
import { stegaValue } from '@app/lib/stega';

export const IMAGE_DEFAULT_QUALITY = 60;

export interface ImageProps extends NextImageProps {
  onImageLoaded?: () => void;
  backupSrc?: boolean;
  backupSrcSize?: number;
}

export function Image({
  className,
  alt,
  onImageLoaded,
  quality = IMAGE_DEFAULT_QUALITY,
  overrideSrc,
  backupSrc,
  backupSrcSize = BREAKPOINTS_MIN.lg.width,
  ...rest
}: ImageProps) {
  const image = useRef<HTMLImageElement>(null);
  const isPresentation = useIsMaybePresentation();

  const [loaded, setLoaded] = useState(false);

  const setImageLoaded = useTimeout(() => {
    setLoaded(true);
    if (onImageLoaded) onImageLoaded();
  }, 350);

  const _onLoad = useCallback(() => {
    setImageLoaded();
  }, [setImageLoaded]);

  useEffect(() => {
    if (image.current && image.current.complete) {
      _onLoad();
    }
  }, [image, _onLoad]);

  return (
    <NextImage
      {...rest}
      overrideSrc={
        overrideSrc ||
        (backupSrc &&
          rest.loader &&
          typeof rest.src == 'string' &&
          rest.loader({
            src: rest.src,
            width: backupSrcSize,
            quality: quality && Number(quality),
          })) ||
        undefined
      }
      loading={isPresentation ? 'eager' : 'lazy'}
      alt={stegaValue(alt)}
      quality={quality}
      className={clsx(
        'block h-auto w-full transition-opacity',
        isPresentation || loaded
          ? 'opacity-1 duration-200'
          : 'opacity-0 duration-0',
        className
      )}
      ref={image}
      onLoad={_onLoad}
    />
  );
}
