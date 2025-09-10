import EasyMDE from 'easymde';
import { useMemo } from 'react';

import {
  MarkdownInputProps,
  MarkdownInput as SanityMarkdownInput,
} from 'sanity-plugin-markdown';

export function MarkdownInput(props: MarkdownInputProps) {
  const reactMdeProps: MarkdownInputProps['reactMdeProps'] = useMemo(() => {
    return {
      options: {
        toolbar: [
          {
            name: 'headings',
            className: 'fa fa-header fa-heading',
            title: 'Headings',
            children: [
              {
                name: 'heading-2',
                action: EasyMDE.toggleHeading2,
                className: 'fa fa-header fa-heading heading-2',
                title: 'Heading 2',
              },
              {
                name: 'heading-3',
                action: EasyMDE.toggleHeading3,
                className: 'fa fa-header fa-heading heading-3',
                title: 'Heading 3',
              },
              {
                name: 'heading-4',
                action: EasyMDE.toggleHeading4,
                className: 'fa fa-header fa-heading heading-4',
                title: 'Heading 4',
              },
            ],
          },
          'bold',
          'italic',
          '|',
          'quote',
          'unordered-list',
          'ordered-list',
          '|',
          'link',
          'code',
          // '|',
          // 'preview',
          // 'side-by-side',
        ],
        uploadImage: false,
        // more options available, see:
        // https://github.com/Ionaru/easy-markdown-editor#options-list
      },
      // more props available, see:
      // https://github.com/RIP21/react-simplemde-editor#react-simplemde-easymde-markdown-editor
    };
  }, []);

  return <SanityMarkdownInput {...props} reactMdeProps={reactMdeProps} />;
}
