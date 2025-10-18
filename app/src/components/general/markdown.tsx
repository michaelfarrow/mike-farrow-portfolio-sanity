import ReactMarkdown, { Options as ReactMarkdownProps } from 'react-markdown';
import { ComponentPropsWithRef } from 'react';

import { nodeToString } from '@app/lib/react';
import { Code } from '@app/components/general/code';

export type MarkdownProps = Omit<ReactMarkdownProps, 'components'>;

export const PreComponent = (props: ComponentPropsWithRef<'pre'>) => {
  const { children } = props;
  const flatChildren = [children].flat();
  const firstChild = flatChildren[0];

  const codeClassName =
    firstChild &&
    typeof firstChild === 'object' &&
    'props' in firstChild &&
    firstChild.props &&
    typeof firstChild.props === 'object' &&
    'className' in firstChild.props &&
    typeof firstChild.props.className === 'string'
      ? firstChild.props.className
      : undefined;

  const match = /language-(\w+)/.exec(codeClassName || '');

  const code = nodeToString(children);

  return <Code language={(match && match[1]) || 'plaintext'} value={code} />;
};

export function Markdown(props: MarkdownProps) {
  return <ReactMarkdown {...props} components={{ pre: PreComponent }} />;
}
