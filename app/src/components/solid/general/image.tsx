import clsx from 'clsx';
import { createSignal, onMount, splitProps } from 'solid-js';
import { type JSX } from 'solid-js/jsx-runtime';

import styles from './image.module.css';

export type Props = JSX.ImgHTMLAttributes<HTMLImageElement>;

export function Image(props: Props) {
  let image: HTMLImageElement | undefined;

  const [loaded, setLoaded] = createSignal(false);
  const [local, rest] = splitProps(props, ['onLoad']);

  const onLoad: JSX.EventHandlerUnion<HTMLImageElement, Event> = (e) => {
    setLoaded(true);

    if (local.onLoad) {
      if (typeof local.onLoad === 'function') {
        local.onLoad(e);
      } else {
        local.onLoad[0](local.onLoad[1], e);
      }
    }
  };

  onMount(() => {
    if (image && image.complete) {
      setLoaded(true);
    }
  });

  return (
    <img
      ref={image}
      class={clsx(styles.img, loaded() && styles.imgLoaded)}
      onLoad={onLoad}
      {...rest}
    />
  );
}
