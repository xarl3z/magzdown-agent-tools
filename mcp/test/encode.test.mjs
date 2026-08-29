import test from "node:test";
import assert from "node:assert/strict";
import { encodePayload, magzdownUrl } from "../dist/encode.js";

test("known vector: '# Hi' -> AQAjIEhp", () => {
  assert.equal(encodePayload("# Hi"), "AQAjIEhp");
  assert.equal(magzdownUrl("# Hi"), "https://www.magzdown.com/open?md=AQAjIEhp");
});

test("payload starts with 01 00 and is url-safe without padding", () => {
  const enc = encodePayload("héllo ~ ?/+");
  const bytes = Buffer.from(enc, "base64url");
  assert.deepEqual([...bytes.subarray(0, 2)], [0x01, 0x00]);
  assert.equal(bytes.subarray(2).toString("utf8"), "héllo ~ ?/+");
  assert.doesNotMatch(enc, /[+/=]/);
});
