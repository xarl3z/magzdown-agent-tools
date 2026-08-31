#!/usr/bin/env node
import { execFile } from "node:child_process";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { MAX_MARKDOWN_BYTES, magzdownUrl } from "./encode.js";

const TOOL = {
  name: "open_in_magzdown",
  description:
    "Render markdown as a typeset, paginated document at a Magzdown URL. " +
    "Returns the link; hand it to the user as a markdown link instead of pasting the raw markdown. " +
    "The document is encoded in the URL, nothing is uploaded, so the link is the document: anyone holding it can read the content. " +
    "Ask the user before creating a link, and do not encode secrets, personal data, or material marked confidential. " +
    "Keep markdown under about 100 KB.",
  inputSchema: {
    type: "object",
    properties: {
      markdown: { type: "string", description: "The markdown document to render." },
      title: { type: "string", description: "Optional title, used as the link text in the response." },
    },
    required: ["markdown"],
  },
} as const;

const server = new Server({ name: "magzdown", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [TOOL] }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name !== TOOL.name) {
    return { isError: true, content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }] };
  }
  const args = (req.params.arguments ?? {}) as { markdown?: unknown; title?: unknown };
  if (typeof args.markdown !== "string" || args.markdown.length === 0) {
    return { isError: true, content: [{ type: "text", text: "markdown must be a non-empty string" }] };
  }
  const size = Buffer.byteLength(args.markdown, "utf8");
  if (size > MAX_MARKDOWN_BYTES) {
    return {
      isError: true,
      content: [{ type: "text", text: `markdown is ${size} bytes; keep it under ${MAX_MARKDOWN_BYTES}. Split it or drop embedded images.` }],
    };
  }
  const url = magzdownUrl(args.markdown);
  const title = typeof args.title === "string" && args.title.trim() ? args.title.trim() : "Open in Magzdown";
  if (process.env.MAGZDOWN_AUTO_OPEN === "1") {
    const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    execFile(opener, [url], () => {});
  }
  return { content: [{ type: "text", text: `[${title}](${url})` }] };
});

await server.connect(new StdioServerTransport());
