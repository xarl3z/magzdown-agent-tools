# Magzdown URL encoding

One spec, used by the skill, the Cursor rule and the MCP server in this repo.

## Steps

1. Take the markdown as UTF-8 bytes.
2. Prepend two bytes: `0x01` (format version) and `0x00` (reserved).
3. Base64-encode the whole payload.
4. Make it URL-safe: replace `+` with `-`, `/` with `_`, and strip trailing `=` padding.
5. Put it after `https://www.magzdown.com/open?md=`.

The page decodes the parameter in the browser. Nothing is sent to a server; the document lives in the URL.

## Known vector

Markdown `# Hi` (bytes `23 20 48 69`) becomes payload `01 00 23 20 48 69`, base64url `AQAjIEhp`, so the link is:

```
https://www.magzdown.com/open?md=AQAjIEhp
```

## Size

Keep the markdown under about 100 KB (about 135 KB encoded). Beyond that, browsers and proxies may truncate the URL and the reader shows a corrupted document. If the document is bigger, split it or drop embedded base64 images.

## Reference implementations

Shell (macOS or GNU coreutils):

```bash
printf 'https://www.magzdown.com/open?md=%s\n' "$(printf '\x01\x00' | cat - report.md | base64 | tr '+/' '-_' | tr -d '=\n')"
```

Python:

```python
import base64

def magzdown_url(markdown: str) -> str:
    payload = b"\x01\x00" + markdown.encode("utf-8")
    return "https://www.magzdown.com/open?md=" + base64.urlsafe_b64encode(payload).rstrip(b"=").decode()
```

Node:

```js
const url = "https://www.magzdown.com/open?md=" +
  Buffer.concat([Buffer.from([1, 0]), Buffer.from(markdown, "utf8")]).toString("base64url");
```

Full docs: https://www.magzdown.com/docs

## Caution

The document travels inside the URL, so the link is the document. Anyone holding it can read the content, and it lands in browser history and in whatever chat it is pasted into. Ask before creating a link, and never encode secrets, personal data, or material marked confidential.
