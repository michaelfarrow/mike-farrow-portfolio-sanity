import { For, splitProps } from 'solid-js';
import { type JSX } from 'solid-js/jsx-runtime';

import {
  Image,
  type Props as ImageProps,
} from '@app/components/solid/general/image';

export interface Props extends JSX.HTMLAttributes<HTMLPictureElement> {
  image: ImageProps;
  sources: JSX.SourceHTMLAttributes<HTMLSourceElement>[];
}

export function Picture(props: Props) {
  const [local, rest] = splitProps(props, ['image', 'sources']);

  return (
    <picture {...rest}>
      <For each={local.sources}>{(source) => <source {...source} />}</For>
      <Image {...local.image} />
    </picture>
  );
}
