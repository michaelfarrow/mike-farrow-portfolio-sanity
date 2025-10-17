'use client';

import clsx from 'clsx';
import { omit, orderBy } from 'lodash-es';
import React from 'react';
import { getImageProps, ImageProps } from 'next/image';

import { Image, IMAGE_DEFAULT_QUALITY } from '@app/components/general/image';

export type PictureImage = {
  src: string;
  width: number;
  height: number;
  min?: number;
};

export interface PictureProps
  extends React.ComponentPropsWithoutRef<'picture'>,
    Pick<ImageProps, 'alt' | 'loader' | 'quality'> {
  images: PictureImage[];
  sizes?: string;
  onImageLoaded?: () => void;
}

export function Picture({
  className,
  images,
  alt,
  quality = IMAGE_DEFAULT_QUALITY,
  loader,
  sizes,
  onImageLoaded,
  ...rest
}: PictureProps) {
  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <Image
        {...images[0]}
        alt={alt}
        quality={quality}
        loader={loader}
        sizes={sizes}
        onImageLoaded={onImageLoaded}
        backupSrc
      />
    );
  }

  const imagesSorted = orderBy(images, 'min', 'asc');
  const defaultImage = imagesSorted[0];

  const imageProps = (image: PictureImage) => {
    const { src, width, height } = image;

    return getImageProps({
      alt: '',
      quality,
      loader,
      sizes,
      src,
      width,
      height,
    });
  };

  return (
    <picture className={clsx('block', className)} {...rest}>
      {imagesSorted.map(({ min, ...image }, i) => {
        const {
          props: { srcSet, sizes, width, height },
        } = imageProps(image);

        return (
          <source
            key={i}
            sizes={sizes}
            width={width}
            height={height}
            media={min ? `(min-width: ${min}px)` : undefined}
            srcSet={srcSet}
          />
        );
      })}
      <Image
        {...omit(defaultImage, 'min')}
        alt={alt}
        quality={quality}
        loader={loader}
        sizes={sizes}
        onImageLoaded={onImageLoaded}
        backupSrc
      />
    </picture>
  );
}
