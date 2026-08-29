export const BASE_URL = "https://www.magzdown.com/open?md=";
export const MAX_MARKDOWN_BYTES = 100 * 1024;

export function encodePayload(markdown: string): string {
  const payload = Buffer.concat([Buffer.from([0x01, 0x00]), Buffer.from(markdown, "utf8")]);
  return payload.toString("base64url");
}

export function magzdownUrl(markdown: string): string {
  return BASE_URL + encodePayload(markdown);
}
