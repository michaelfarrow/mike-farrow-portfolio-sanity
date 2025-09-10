import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import { Flex, Text } from '@sanity/ui';
import { type PreviewProps } from 'sanity';

export interface MarkdownPreviewProps extends PreviewProps {
  className?: string;
  content?: string;
}

const Preview = ({ className, content }: MarkdownPreviewProps) => {
  return (
    <div className={className}>
      <Flex padding={2}>
        <div className='container'>
          <Text as='div' className='content' size={2}>
            {(content && <ReactMarkdown>{content}</ReactMarkdown>) || 'Blank'}
          </Text>
          {/* <div className='cover'></div> */}
        </div>
      </Flex>
    </div>
  );
};

export const MarkdownPreview = styled(Preview)`
  .container {
    position: relative;
  }

  .content {
    padding: 1em 0;
  }

  .content > span > p,
  .content > span > blockquote {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .content > span > blockquote {
    margin-left: 0;
    padding-left: 1em;
    margin-left: 0.5em;
    border-left: 2px solid var(--card-hairline-soft-color);
  }

  .content > span > h1,
  .content > span > h2,
  .content > span > h3,
  .content > span > h4,
  .content > span > h5,
  .content > span > h6 {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .content > span > h1 {
    font-size: 1.5em;
  }

  .content > span > h2 {
    font-size: 1.4em;
  }

  .content > span > h3 {
    font-size: 1.3em;
  }

  .content > span > h4 {
    font-size: 1.2em;
  }

  .content > span > h5 {
    font-size: 1.1em;
  }

  .content > span > h6 {
    font-size: 1em;
  }

  .content > span > *:first-child {
    margin-top: 0;
  }

  .content > span > *:last-child {
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
