import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import { aesEcbPaddedSize, encryptAesEcb, classifyMedia } from "./media.js";

describe("aesEcbPaddedSize", () => {
  it("0 bytes -> 16 (one full padding block)", () => {
    assert.equal(aesEcbPaddedSize(0), 16);
  });

  it("1 byte -> 16", () => {
    assert.equal(aesEcbPaddedSize(1), 16);
  });

  it("15 bytes -> 16 (PKCS7 adds 1 byte of padding)", () => {
    assert.equal(aesEcbPaddedSize(15), 16);
  });

  it("16 bytes -> 32 (PKCS7 adds full padding block)", () => {
    assert.equal(aesEcbPaddedSize(16), 32);
  });

  it("17 bytes -> 32", () => {
    assert.equal(aesEcbPaddedSize(17), 32);
  });

  it("31 bytes -> 32", () => {
    assert.equal(aesEcbPaddedSize(31), 32);
  });

  it("32 bytes -> 48", () => {
    assert.equal(aesEcbPaddedSize(32), 48);
  });

  it("matches actual ciphertext length", () => {
    for (const size of [0, 1, 15, 16, 17, 31, 32, 100, 255, 1024]) {
      const key = crypto.randomBytes(16);
      const plaintext = crypto.randomBytes(size);
      const ciphertext = encryptAesEcb(plaintext, key);
      assert.equal(
        aesEcbPaddedSize(size),
        ciphertext.length,
        `size=${size}: expected ${ciphertext.length}, got ${aesEcbPaddedSize(size)}`,
      );
    }
  });
});

describe("encryptAesEcb", () => {
  it("encrypts and produces correct length", () => {
    const key = crypto.randomBytes(16);
    const data = Buffer.from("hello world");
    const encrypted = encryptAesEcb(data, key);
    assert.equal(encrypted.length, 16);
  });

  it("different keys produce different ciphertext", () => {
    const data = Buffer.from("same data");
    const key1 = crypto.randomBytes(16);
    const key2 = crypto.randomBytes(16);
    const enc1 = encryptAesEcb(data, key1);
    const enc2 = encryptAesEcb(data, key2);
    assert.ok(!enc1.equals(enc2));
  });

  it("round-trips with node decrypt", () => {
    const key = crypto.randomBytes(16);
    const original = Buffer.from("test round trip data here!");
    const encrypted = encryptAesEcb(original, key);
    const decipher = crypto.createDecipheriv("aes-128-ecb", key, null);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    assert.deepEqual(decrypted, original);
  });
});

describe("classifyMedia", () => {
  it("classifies images", () => {
    for (const ext of [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"]) {
      const r = classifyMedia(`photo${ext}`);
      assert.equal(r.itemType, 2, `${ext} should be IMAGE (2)`);
      assert.equal(r.cdnType, 1, `${ext} CDN type should be 1`);
    }
  });

  it("classifies videos", () => {
    for (const ext of [".mp4", ".mov", ".webm", ".mkv", ".avi"]) {
      const r = classifyMedia(`video${ext}`);
      assert.equal(r.itemType, 5, `${ext} should be VIDEO (5)`);
      assert.equal(r.cdnType, 2, `${ext} CDN type should be 2`);
    }
  });

  it("classifies everything else as file", () => {
    for (const ext of [".pdf", ".doc", ".zip", ".txt", ".unknown", ""]) {
      const r = classifyMedia(`doc${ext}`);
      assert.equal(r.itemType, 4, `${ext} should be FILE (4)`);
      assert.equal(r.cdnType, 3, `${ext} CDN type should be 3`);
    }
  });

  it("is case-insensitive", () => {
    assert.equal(classifyMedia("PHOTO.PNG").itemType, 2);
    assert.equal(classifyMedia("VIDEO.MP4").itemType, 5);
  });
});
