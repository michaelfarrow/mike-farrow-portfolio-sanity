import clsx from 'clsx';

export type ContainerProps = React.ComponentPropsWithoutRef<'div'>;

export function Container({ className, ...rest }: ContainerProps) {
  return (
    <div className={clsx('mx-auto max-w-screen-2xl', className)} {...rest} />
  );
}
