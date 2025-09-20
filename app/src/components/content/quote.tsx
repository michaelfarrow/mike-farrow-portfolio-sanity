import { SanityQuote, SanityQuoteProps } from '@app/components/sanity/quote';

export interface ContentQuoteProps extends SanityQuoteProps {}

export function ContentQuote({ ...rest }: ContentQuoteProps) {
  return <SanityQuote {...rest} />;
}
