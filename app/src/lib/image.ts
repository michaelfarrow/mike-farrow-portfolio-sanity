import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import numToFraction from 'num2fraction';
import { ImageLoader } from 'next/image';

import type { CommonSchemaType } from '@app/types/content';
import { config } from '@app/lib/config';
import { romanize } from '@app/lib/number';

const builder = imageUrlBuilder(config.studio);

type UnknownImageData = {
  [key: string]: number | string | undefined;
};

export type SanityImage = CommonSchemaType<'image'>;

export type ExifData = {
  camera?: string;
  lens?: string;
  settings: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
    exposureCompensation?: string;
  };
};

export function sanityImageCroppedSize(image: SanityImage) {
  const crop = {
    ...{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    ...image.crop,
  };

  const width = image.asset?.metadata?.dimensions?.width;
  const height = image.asset?.metadata?.dimensions?.height;

  return {
    width: width && Math.round(width * (1 - (crop.left + crop.right))),
    height: height && Math.round(height * (1 - (crop.top + crop.bottom))),
  };
}

export function imageUrl(source: SanityImageSource) {
  return builder.image(source);
}

export function processExif<T>(
  transform: (v: string | number) => T | undefined
) {
  return <R>(v: string | number | undefined, process: (v: T) => R) => {
    if (v === undefined) return undefined;
    const t = transform(v);
    if (t === undefined) return undefined;
    return process(t);
  };
}

export const processExifString = processExif((v) => String(v));
export const processExifNumber = processExif((v) => {
  const t = Number(v);
  return isNaN(t) ? undefined : t;
});

export function getExifData(
  source: CommonSchemaType<'image'>
): ExifData | null {
  const { image = {}, exif = {} } =
    (source.asset?.metadata as {
      image?: UnknownImageData;
      exif?: UnknownImageData;
    }) || {};

  if (!Object.keys(image).length && !Object.keys(exif).length) return null;

  const { Model: model } = image;

  const {
    LensModel: lens,
    FocalLength: focalLength,
    ExposureTime: exposure,
    FNumber: aperture,
    ISO: iso,
    ExposureCompensation: exposureCompensation,
  } = exif;

  return {
    camera: processExifString(model, (model) =>
      model.replace(
        /[mM](\d+)/g,
        ({}, digit: string) => ` Mark ${romanize(Number(digit))}`
      )
    ),
    lens: processExifString(lens, (lens) =>
      lens.replace(/(?<=RF)(?=\d)/g, ' ')
    ),
    settings: {
      aperture: processExifNumber(aperture, (aperture) => `f/${aperture}`),
      shutterSpeed: processExifNumber(exposure, (exposure) =>
        exposure < 1 ? numToFraction(exposure) : `${exposure}"`
      ),
      iso: processExifNumber(iso, (iso) => `ISO${iso}`),
      focalLength: processExifNumber(
        focalLength,
        (focalLength) => `${focalLength}mm`
      ),
      exposureCompensation: processExifNumber(
        exposureCompensation,
        (exposureCompensation) =>
          `${Number(exposureCompensation) < 0 ? '-' : '+'}${Math.abs(
            Number(exposureCompensation)
          )} EV`
      ),
    },
  };
}

export const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  // url.searchParams.set('auto', 'format');
  url.searchParams.set('fm', 'webp');
  if (!url.searchParams.has('fit'))
    url.searchParams.set('fit', url.searchParams.has('h') ? 'min' : 'max');
  if (url.searchParams.has('h') && url.searchParams.has('w')) {
    const originalHeight = parseInt(url.searchParams.get('h') || '0', 10);
    const originalWidth = parseInt(url.searchParams.get('w') || '0', 10);
    url.searchParams.set(
      'h',
      Math.round((originalHeight / originalWidth) * width).toString()
    );
  }
  url.searchParams.set('w', width.toString());
  if (quality) url.searchParams.set('q', quality.toString());
  return url.href;
};
