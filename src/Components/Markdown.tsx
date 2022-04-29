import MarkdownIt from 'markdown-it';
import React from 'react';

const mde = new MarkdownIt();

type Props = { className?: string; inline?: boolean } & (
  | { children: string | null }
  | { content: string | null }
);

const Markdown = ({ className, inline = false, ...props }: Props) => {
  const value = 'children' in props ? props.children : props.content;

  if (value === null) {
    return null;
  }

  if (inline) {
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: mde.renderInline(value) }}
      ></span>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: mde.render(value) }}
    ></div>
  );
};

export default Markdown;
export type { Props as IMarkdownProps };
