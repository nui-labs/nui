import type { Options } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Centralized configuration for rehype-pretty-code
 * Used in both Vite config and highlight-code utility
 */
export const REHYPE_PRETTY_CONFIG: Options = {
  // Theme configuration
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },

  // Keep background transparent to use our custom styling
  keepBackground: false,
};

/**
 * Highlight code using rehype-pretty-code with enhanced error handling
 */
export async function highlightCode(
  code: string,
  language: string = "tsx",
): Promise<string> {
  // Validate input
  if (!code || typeof code !== "string") {
    throw new Error("Invalid code input");
  }

  // Trim the code to remove trailing empty lines that Prettier might add
  const trimmedCode = code.trimEnd();

  // Create a markdown code block
  const codeBlock = `\`\`\`${language}\n${trimmedCode}\n\`\`\``;

  // Process with unified pipeline: markdown -> rehype -> pretty-code -> html
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, REHYPE_PRETTY_CONFIG)
    .use(rehypeStringify);

  const result = await processor.process(codeBlock);
  return String(result);
}
