import clsx from 'clsx';
import React from 'react';

import type { CommonSchemaType } from '@app/types/content';
import { Markdown } from '@app/components/content/markdown';
import { MaybeLink } from '@app/components/content/maybe-link';

export type SanityQuote = CommonSchemaType<'quote'>;

export interface SanityQuoteProps
  extends React.ComponentPropsWithoutRef<'div'> {
  quote: SanityQuote;
}

export function SanityQuote({
  quote: { quote, attribution, link },
  className,
  ...rest
}: SanityQuoteProps) {
  return (
    <div {...rest} className={clsx(className)} data-sanity-edit-group>
      <blockquote cite={link?.url}>
        <Markdown value={quote} />
      </blockquote>
      <p>
        —
        <MaybeLink {...link} target='_blank'>
          {attribution}
        </MaybeLink>
      </p>
    </div>
  );
}
