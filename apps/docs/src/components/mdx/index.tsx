import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@nui/core";

import { Icons } from "./icons";
import { InstallationTabs } from "./installation-tabs";
import { LinkCard } from "./link-card";
import { Pre } from "./pre";
import { Preview } from "./preview";
import { Step, Steps } from "./steps";

export const mdxComponents = {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  AlertTitle,
  AlertDescription,

  // Custom components
  Steps,
  Step,
  Preview,
  Icons,
  LinkCard,
  InstallationTabs,

  // Headings
  h1: ({ children, ...props }: React.ComponentProps<"h1">) => (
    <h1 className="text-4xl font-bold tracking-tight mb-6" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
    <h2 className="text-3xl font-semibold tracking-tight mb-4 mt-8" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentProps<"h3">) => (
    <h3 className="text-2xl font-semibold tracking-tight mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.ComponentProps<"h4">) => (
    <h4 className="text-xl font-semibold tracking-tight mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.ComponentProps<"h5">) => (
    <h5 className="text-lg font-semibold tracking-tight mb-2 mt-4" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: React.ComponentProps<"h6">) => (
    <h6 className="text-base font-semibold tracking-tight mb-2 mt-4" {...props}>
      {children}
    </h6>
  ),

  // Paragraphs and text
  p: ({ children, ...props }: React.ComponentProps<"p">) => (
    <p className="leading-7 mb-4" {...props}>
      {children}
    </p>
  ),

  // Lists
  ul: ({ children, ...props }: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.ComponentProps<"ol">) => (
    <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.ComponentProps<"li">) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),

  // Links
  a: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
      {...props}
    >
      {children}
    </a>
  ),

  // Code
  code: ({ children, ...props }: React.ComponentProps<"code">) => (
    <code {...props}>{children}</code>
  ),
  pre: Pre,

  // Blockquotes
  blockquote: ({ children, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="my-8 border-gray-200" {...props} />
  ),

  // Tables
  table: ({ children, ...props }: React.ComponentProps<"table">) => (
    <div className="mb-4 overflow-x-auto">
      <table
        className="min-w-full border-collapse border border-gray-200"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.ComponentProps<"thead">) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.ComponentProps<"tbody">) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: React.ComponentProps<"tr">) => (
    <tr className="border-b border-gray-200" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.ComponentProps<"th">) => (
    <th
      className="border border-gray-200 px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentProps<"td">) => (
    <td className="border border-gray-200 px-4 py-2" {...props}>
      {children}
    </td>
  ),
};
