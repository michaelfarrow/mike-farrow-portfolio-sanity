import React from 'react';

export interface FigureProps extends React.ComponentPropsWithoutRef<'figure'> {
  caption: React.ReactNode;
  captionClassName?: string;
}

export function Figure({
  caption,
  captionClassName,
  children,
  ...rest
}: FigureProps) {
  return (
    <figure {...rest}>
      {children}
      <figcaption className={captionClassName}>{caption}</figcaption>
    </figure>
  );
}
