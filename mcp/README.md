# magzdown-mcp

One tool, `open_in_magzdown`. Input `{ markdown: string, title?: string }`. Output: a markdown link to `https://www.magzdown.com/open?md=...` that renders the document. Rejects markdown over 100 KB. Encoding is in [../shared/encode.md](../shared/encode.md).

Set `MAGZDOWN_AUTO_OPEN=1` and the server also opens the link in your default browser (`open` on macOS, `xdg-open` on Linux, `start` on Windows).

## Build

```bash
cd mcp
npm install
npm run build
npm test
```

## Claude Code

```bash
claude mcp add magzdown -- node /absolute/path/to/magzdown-agent-tools/mcp/dist/index.js
```

With auto-open:

```bash
claude mcp add magzdown -e MAGZDOWN_AUTO_OPEN=1 -- node /absolute/path/to/magzdown-agent-tools/mcp/dist/index.js
```

## Cursor

`.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` for all projects:

```json
{
  "mcpServers": {
    "magzdown": {
      "command": "node",
      "args": ["/absolute/path/to/magzdown-agent-tools/mcp/dist/index.js"],
      "env": { "MAGZDOWN_AUTO_OPEN": "1" }
    }
  }
}
```

## Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, `%APPDATA%\Claude\claude_desktop_config.json` on Windows:

```json
{
  "mcpServers": {
    "magzdown": {
      "command": "node",
      "args": ["/absolute/path/to/magzdown-agent-tools/mcp/dist/index.js"]
    }
  }
}
```

Restart the client after editing the config.
