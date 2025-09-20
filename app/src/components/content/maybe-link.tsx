export interface MaybeLinkProps extends React.ComponentProps<'a'> {
  name?: string;
  shortName?: string;
  url?: string;
  children?: string;
}

export function MaybeLink({
  children,
  shortName,
  name,
  url,
  className,
  ...rest
}: MaybeLinkProps) {
  const content = children || shortName || name;
  const El = url ? 'a' : 'span';
  return (
    (content && (
      <El {...(url ? rest : {})} href={url} className={className}>
        {content}
      </El>
    )) ||
    null
  );
}
