import { Fragment, type ElementType } from "react";

interface WordsProps {
  text: string;
  as?: ElementType;
  className?: string;
  mask?: boolean;
  id?: string;
  [data: `data-${string}`]: string | boolean | undefined;
}

export default function Words({ text, as: Tag = "span", className = "", mask = true, ...rest }: WordsProps) {
  const words = text.split(" ");

  return (
    <Tag className={className} {...rest}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className={`inline-block align-top ${mask ? "-mb-[0.14em] overflow-hidden pb-[0.14em]" : ""}`}>
              <span data-w className="inline-block">
                {w}
              </span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
