import type { CSSProperties, JSX } from 'react';

import type { CommonSchemaType } from '@app/types/content';

export type SanityImage = CommonSchemaType<'image'>;

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

export type ImageLoaderPropsWithConfig = ImageLoaderProps & {
  config: Readonly<ImageConfig>;
};

export type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export type ImageConfigComplete = {
  deviceSizes: number[];
  imageSizes: number[];
  unoptimized: boolean;
};

const imageConfigDefault: ImageConfigComplete = {
  deviceSizes: [160, 320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  unoptimized: false,
};

export function getImageBlurSvg({
  widthInt,
  heightInt,
  blurWidth,
  blurHeight,
  blurDataURL,
  objectFit,
}: {
  widthInt?: number;
  heightInt?: number;
  blurWidth?: number;
  blurHeight?: number;
  blurDataURL: string;
  objectFit?: string;
}): string {
  const std = 20;
  const svgWidth = blurWidth ? blurWidth * 40 : widthInt;
  const svgHeight = blurHeight ? blurHeight * 40 : heightInt;

  const viewBox =
    svgWidth && svgHeight ? `viewBox='0 0 ${svgWidth} ${svgHeight}'` : '';
  const preserveAspectRatio = viewBox
    ? 'none'
    : objectFit === 'contain'
      ? 'xMidYMid'
      : objectFit === 'cover'
        ? 'xMidYMid slice'
        : 'none';

  return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${viewBox}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${preserveAspectRatio}' style='filter: url(%23b);' href='${blurDataURL}'/%3E%3C/svg%3E`;
}

export interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

export type ImageProps = Pick<JSX.IntrinsicElements['img'], 'sizes'> & {
  src: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  loader: ImageLoader;
  quality?: number | `${number}`;
  unoptimized?: boolean;
  overrideSrc?: string;
};

export type ImgProps = {
  width: number | undefined;
  height: number | undefined;
  srcSet: string | undefined;
  src: string;
};

// const VALID_LOADING_VALUES = ['lazy', 'eager', undefined] as const;

// // Object-fit values that are not valid background-size values
// const INVALID_BACKGROUND_SIZE_VALUES = [
//   '-moz-initial',
//   'fill',
//   'none',
//   'scale-down',
//   undefined,
// ];
// type LoadingValue = (typeof VALID_LOADING_VALUES)[number];
type ImageConfig = ImageConfigComplete & {
  allSizes: number[];
};

export type ImageLoader = (p: ImageLoaderProps) => string;

// Do not export - this is an internal type only
// because `next.config.js` is only meant for the
// built-in loaders, not for a custom loader() prop.
type ImageLoaderWithConfig = (p: ImageLoaderPropsWithConfig) => string;

export type PlaceholderValue = 'blur' | 'empty' | `data:image/${string}`;
export type OnLoad = React.ReactEventHandler<HTMLImageElement> | undefined;
export type OnLoadingComplete = (img: HTMLImageElement) => void;

export type PlaceholderStyle = Partial<
  Pick<
    CSSProperties,
    | 'backgroundSize'
    | 'backgroundPosition'
    | 'backgroundRepeat'
    | 'backgroundImage'
  >
>;

function getInt(x: unknown): number | undefined {
  if (typeof x === 'undefined') {
    return x;
  }
  if (typeof x === 'number') {
    return Number.isFinite(x) ? x : NaN;
  }
  if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
    return parseInt(x, 10);
  }
  return NaN;
}

function getWidths(
  { deviceSizes, allSizes }: ImageConfig,
  width: number | undefined,
  sizes: string | undefined
): { widths: number[]; kind: 'w' | 'x' } {
  if (sizes) {
    // Find all the "vw" percent sizes used in the sizes prop
    const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
    const percentSizes = [];
    for (let match; (match = viewportWidthRe.exec(sizes)); match) {
      percentSizes.push(parseInt(match[2]));
    }
    if (percentSizes.length) {
      const smallestRatio = Math.min(...percentSizes) * 0.01;
      return {
        widths: allSizes.filter((s) => s >= deviceSizes[0] * smallestRatio),
        kind: 'w',
      };
    }
    return { widths: allSizes, kind: 'w' };
  }

  if (typeof width !== 'number') {
    return { widths: deviceSizes, kind: 'w' };
  }

  // > This means that most OLED screens that say they are 3x resolution,
  // > are actually 3x in the green color, but only 1.5x in the red and
  // > blue colors. Showing a 3x resolution image in the app vs a 2x
  // > resolution image will be visually the same, though the 3x image
  // > takes significantly more data. Even true 3x resolution screens are
  // > wasteful as the human eye cannot see that level of detail without
  // > something like a magnifying glass.
  // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
  const widths = [
    ...new Set(
      [width, width * 2 /*, width * 3*/].map(
        (w) => allSizes.find((p) => p >= w) || allSizes[allSizes.length - 1]
      )
    ),
  ];
  return { widths, kind: 'x' };
}

type GenImgAttrsData = {
  config: ImageConfig;
  src: string;
  unoptimized: boolean;
  loader: ImageLoaderWithConfig;
  width?: number;
  quality?: number;
  sizes?: string;
};

type GenImgAttrsResult = {
  src: string;
  srcSet: string | undefined;
};

function generateImgAttrs({
  config,
  src,
  unoptimized,
  width,
  quality,
  sizes,
  loader,
}: GenImgAttrsData): GenImgAttrsResult {
  if (unoptimized) {
    return { src, srcSet: undefined };
  }

  const { widths, kind } = getWidths(config, width, sizes);

  const last = widths.length - 1;

  return {
    srcSet: widths
      .map(
        (w, i) =>
          `${loader({ config, src, quality, width: w })} ${
            kind === 'w' ? w : i + 1
          }${kind}`
      )
      .join(', '),

    // It's intended to keep `src` the last attribute because React updates
    // attributes in order. If we keep `src` the first one, Safari will
    // immediately start to fetch `src`, before `sizes` and `srcSet` are even
    // updated by React. That causes multiple unnecessary requests if `srcSet`
    // and `sizes` are defined.
    // This bug cannot be reproduced in Chrome or Firefox.
    src: loader({ config, src, quality, width: widths[last] }),
  };
}

/**
 * A shared function, used on both client and server, to generate the props for <img>.
 */
export function getImgProps({
  src,
  sizes,
  unoptimized = false,
  quality,
  width,
  height,
  loader,
  overrideSrc,
}: ImageProps): ImgProps {
  let config: ImageConfig;
  const c = imageConfigDefault;

  if ('allSizes' in c) {
    config = c as ImageConfig;
  } else {
    const allSizes = [...c.deviceSizes, ...c.imageSizes].sort((a, b) => a - b);
    const deviceSizes = c.deviceSizes.sort((a, b) => a - b);
    config = { ...c, allSizes, deviceSizes };
  }

  const widthInt = getInt(width);
  const heightInt = getInt(height);
  // let blurWidth: number | undefined;
  // let blurHeight: number | undefined;

  if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
    // https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    unoptimized = true;
  }

  if (config.unoptimized) {
    unoptimized = true;
  }

  const qualityInt = getInt(quality);

  // if (process.env.NODE_ENV !== 'production') {
  //   if (config.output === 'export' && isDefaultLoader && !unoptimized) {
  //     throw new Error(
  //       `Image Optimization using the default loader is not compatible with \`{ output: 'export' }\`.
  // Possible solutions:
  //   - Remove \`{ output: 'export' }\` and run "next start" to run server mode including the Image Optimization API.
  //   - Configure \`{ images: { unoptimized: true } }\` in \`next.config.js\` to disable the Image Optimization API.
  // Read more: https://nextjs.org/docs/messages/export-image-api`
  //     );
  //   }
  //   if (!src) {
  //     // React doesn't show the stack trace and there's
  //     // no `src` to help identify which image, so we
  //     // instead console.error(ref) during mount.
  //     unoptimized = true;
  //   } else {
  //     if (fill) {
  //       if (width) {
  //         throw new Error(
  //           `Image with src "${src}" has both "width" and "fill" properties. Only one should be used.`
  //         );
  //       }
  //       if (height) {
  //         throw new Error(
  //           `Image with src "${src}" has both "height" and "fill" properties. Only one should be used.`
  //         );
  //       }
  //       if (style?.position && style.position !== 'absolute') {
  //         throw new Error(
  //           `Image with src "${src}" has both "fill" and "style.position" properties. Images with "fill" always use position absolute - it cannot be modified.`
  //         );
  //       }
  //       if (style?.width && style.width !== '100%') {
  //         throw new Error(
  //           `Image with src "${src}" has both "fill" and "style.width" properties. Images with "fill" always use width 100% - it cannot be modified.`
  //         );
  //       }
  //       if (style?.height && style.height !== '100%') {
  //         throw new Error(
  //           `Image with src "${src}" has both "fill" and "style.height" properties. Images with "fill" always use height 100% - it cannot be modified.`
  //         );
  //       }
  //     } else {
  //       if (typeof widthInt === 'undefined') {
  //         throw new Error(
  //           `Image with src "${src}" is missing required "width" property.`
  //         );
  //       } else if (isNaN(widthInt)) {
  //         throw new Error(
  //           `Image with src "${src}" has invalid "width" property. Expected a numeric value in pixels but received "${width}".`
  //         );
  //       }
  //       if (typeof heightInt === 'undefined') {
  //         throw new Error(
  //           `Image with src "${src}" is missing required "height" property.`
  //         );
  //       } else if (isNaN(heightInt)) {
  //         throw new Error(
  //           `Image with src "${src}" has invalid "height" property. Expected a numeric value in pixels but received "${height}".`
  //         );
  //       }
  //       // eslint-disable-next-line no-control-regex
  //       if (/^[\x00-\x20]/.test(src)) {
  //         throw new Error(
  //           `Image with src "${src}" cannot start with a space or control character. Use src.trimStart() to remove it or encodeURIComponent(src) to keep it.`
  //         );
  //       }
  //       // eslint-disable-next-line no-control-regex
  //       if (/[\x00-\x20]$/.test(src)) {
  //         throw new Error(
  //           `Image with src "${src}" cannot end with a space or control character. Use src.trimEnd() to remove it or encodeURIComponent(src) to keep it.`
  //         );
  //       }
  //     }
  //   }
  //   if (!VALID_LOADING_VALUES.includes(loading)) {
  //     throw new Error(
  //       `Image with src "${src}" has invalid "loading" property. Provided "${loading}" should be one of ${VALID_LOADING_VALUES.map(
  //         String
  //       ).join(',')}.`
  //     );
  //   }
  //   if (priority && loading === 'lazy') {
  //     throw new Error(
  //       `Image with src "${src}" has both "priority" and "loading='lazy'" properties. Only one should be used.`
  //     );
  //   }
  //   if (preload && loading === 'lazy') {
  //     throw new Error(
  //       `Image with src "${src}" has both "preload" and "loading='lazy'" properties. Only one should be used.`
  //     );
  //   }
  //   if (preload && priority) {
  //     throw new Error(
  //       `Image with src "${src}" has both "preload" and "priority" properties. Only "preload" should be used.`
  //     );
  //   }
  //   if (
  //     placeholder !== 'empty' &&
  //     placeholder !== 'blur' &&
  //     !placeholder.startsWith('data:image/')
  //   ) {
  //     throw new Error(
  //       `Image with src "${src}" has invalid "placeholder" property "${placeholder}".`
  //     );
  //   }
  //   if (placeholder !== 'empty') {
  //     if (widthInt && heightInt && widthInt * heightInt < 1600) {
  //       warnOnce(
  //         `Image with src "${src}" is smaller than 40x40. Consider removing the "placeholder" property to improve performance.`
  //       );
  //     }
  //   }
  //   if (
  //     qualityInt &&
  //     config.qualities &&
  //     !config.qualities.includes(qualityInt)
  //   ) {
  //     warnOnce(
  //       `Image with src "${src}" is using quality "${qualityInt}" which is not configured in images.qualities [${config.qualities.join(', ')}]. Please update your config to [${[...config.qualities, qualityInt].sort().join(', ')}].` +
  //         `\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-qualities`
  //     );
  //   }
  //   if (
  //     src.startsWith('/') &&
  //     src.includes('?') &&
  //     (!config?.localPatterns?.length ||
  //       (config.localPatterns.length === 1 &&
  //         config.localPatterns[0].pathname === '/_next/static/media/**'))
  //   ) {
  //     warnOnce(
  //       `Image with src "${src}" is using a query string which is not configured in images.localPatterns. This config will be required starting in Next.js 16.` +
  //         `\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`
  //     );
  //   }
  //   if (placeholder === 'blur' && !blurDataURL) {
  //     const VALID_BLUR_EXT = ['jpeg', 'png', 'webp', 'avif']; // should match next-image-loader

  //     throw new Error(
  //       `Image with src "${src}" has "placeholder='blur'" property but is missing the "blurDataURL" property.
  //       Possible solutions:
  //         - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image
  //         - Change the "src" property to a static import with one of the supported file types: ${VALID_BLUR_EXT.join(
  //           ','
  //         )} (animated images not supported)
  //         - Remove the "placeholder" property, effectively no blur effect
  //       Read more: https://nextjs.org/docs/messages/placeholder-blur-data-url`
  //     );
  //   }
  //   if ('ref' in rest) {
  //     warnOnce(
  //       `Image with src "${src}" is using unsupported "ref" property. Consider using the "onLoad" property instead.`
  //     );
  //   }

  //   if (!unoptimized) {
  //     const urlStr = loader({
  //       config,
  //       src,
  //       width: widthInt || 400,
  //       quality: qualityInt || 75,
  //     });
  //     let url: URL | undefined;
  //     try {
  //       url = new URL(urlStr);
  //     } catch (err) {}
  //     if (urlStr === src || (url && url.pathname === src && !url.search)) {
  //       warnOnce(
  //         `Image with src "${src}" has a "loader" property that does not implement width. Please implement it or use the "unoptimized" property instead.` +
  //           `\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader-width`
  //       );
  //     }
  //   }
  // }

  // const imgStyle = Object.assign(
  //   fill
  //     ? {
  //         position: 'absolute',
  //         height: '100%',
  //         width: '100%',
  //         left: 0,
  //         top: 0,
  //         right: 0,
  //         bottom: 0,
  //         objectFit,
  //         objectPosition,
  //       }
  //     : {},
  //   showAltText ? {} : { color: 'transparent' },
  //   style
  // );

  // const backgroundImage =
  //   !blurComplete && placeholder !== 'empty'
  //     ? placeholder === 'blur'
  //       ? `url("data:image/svg+xml;charset=utf-8,${getImageBlurSvg({
  //           widthInt,
  //           heightInt,
  //           blurWidth,
  //           blurHeight,
  //           blurDataURL: blurDataURL || '', // assume not undefined
  //           objectFit: imgStyle.objectFit,
  //         })}")`
  //       : `url("${placeholder}")` // assume `data:image/`
  //     : null;

  // const backgroundSize = !INVALID_BACKGROUND_SIZE_VALUES.includes(
  //   imgStyle.objectFit
  // )
  //   ? imgStyle.objectFit
  //   : imgStyle.objectFit === 'fill'
  //     ? '100% 100%' // the background-size equivalent of `fill`
  //     : 'cover';

  // let placeholderStyle: PlaceholderStyle = backgroundImage
  //   ? {
  //       backgroundSize,
  //       backgroundPosition: imgStyle.objectPosition || '50% 50%',
  //       backgroundRepeat: 'no-repeat',
  //       backgroundImage,
  //     }
  //   : {};

  // if (process.env.NODE_ENV === 'development') {
  //   if (
  //     placeholderStyle.backgroundImage &&
  //     placeholder === 'blur' &&
  //     blurDataURL?.startsWith('/')
  //   ) {
  //     // During `next dev`, we don't want to generate blur placeholders with webpack
  //     // because it can delay starting the dev server. Instead, `next-image-loader.js`
  //     // will inline a special url to lazily generate the blur placeholder at request time.
  //     placeholderStyle.backgroundImage = `url("${blurDataURL}")`;
  //   }
  // }

  const imgAttributes = generateImgAttrs({
    config,
    src,
    unoptimized,
    width: widthInt,
    quality: qualityInt,
    sizes,
    loader,
  });

  const props: ImgProps = {
    width: widthInt,
    height: heightInt,
    srcSet: imgAttributes.srcSet,
    src: overrideSrc || imgAttributes.src,
  };

  return props;
}
