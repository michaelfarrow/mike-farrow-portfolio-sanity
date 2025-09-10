import { PortableText, PortableTextBlock } from '@portabletext/react';
import { isValidElementType } from 'react-is';
import styled from 'styled-components';

import { Flex, Text } from '@sanity/ui';
import { type PreviewProps } from 'sanity';

export interface RichTextPreviewProps extends PreviewProps {
  className?: string;
  content?: PortableTextBlock[];
}

const Preview = ({ className, content }: RichTextPreviewProps) => {
  return (
    <div className={className}>
      <Flex padding={2}>
        <div className='container'>
          <div className='content'>
            {(content && (
              <PortableText
                value={content}
                components={{
                  block: ({ value, children }) => {
                    if (value.style?.match(/^h\d$/)) {
                      const Heading = value.style;
                      if (isValidElementType(Heading))
                        return <Heading>{children}</Heading>;
                    }

                    if (value.style === 'blockquote') {
                      return (
                        <blockquote>
                          <Text as='span' size={2}>
                            {children}
                          </Text>
                        </blockquote>
                      );
                    }

                    return (
                      <p>
                        <Text as='span' size={2}>
                          {children}
                        </Text>
                      </p>
                    );
                  },
                }}
              />
            )) || (
              <Text as='span' size={2}>
                Blank
              </Text>
            )}
          </div>
          <div className='cover'></div>
        </div>
      </Flex>
    </div>
  );
};

export const RichTextPreview = styled(Preview)`
  .container {
    position: relative;
  }

  .content {
    padding: 1em 0;
  }

  .content > p,
  .content > blockquote {
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .content > blockquote {
    margin-left: 0;
    padding-left: 1em;
    margin-left: 0.5em;
    border-left: 2px solid var(--card-hairline-soft-color);
  }

  .content > h1,
  .content > h2,
  .content > h3,
  .content > h4,
  .content > h5,
  .content > h6 {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .content > h1 {
    font-size: 1.5em;
  }

  .content > h2 {
    font-size: 1.4em;
  }

  .content > h3 {
    font-size: 1.3em;
  }

  .content > h4 {
    font-size: 1.2em;
  }

  .content > h5 {
    font-size: 1.1em;
  }

  .content > h6 {
    font-size: 1em;
  }

  .content > *:first-child {
    margin-top: 0;
  }

  .content > *:last-child {
    margin-bottom: 0;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
