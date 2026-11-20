import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { checkAIServiceHealth, AIServiceError } from "../services/aiService.js";

test("checkAIServiceHealth returns the upstream health payload", async () => {
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  }));
  try {
    assert.deepEqual(await checkAIServiceHealth(), { status: "ok" });
  } finally {
    mock.restoreAll();
  }
});

test("checkAIServiceHealth preserves an upstream client error status", async () => {
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ detail: "Unreadable PDF" }), {
    status: 422,
    headers: { "content-type": "application/json" },
  }));
  try {
    await assert.rejects(checkAIServiceHealth(), (error) => {
      assert.ok(error instanceof AIServiceError);
      assert.equal(error.statusCode, 422);
      assert.equal(error.message, "Unreadable PDF");
      return true;
    });
  } finally {
    mock.restoreAll();
  }
});

test("checkAIServiceHealth maps network failures to 503", async () => {
  mock.method(globalThis, "fetch", async () => { throw new TypeError("fetch failed"); });
  try {
    await assert.rejects(checkAIServiceHealth(), (error) => {
      assert.equal(error.statusCode, 503);
      assert.equal(error.message, "AI service is currently unavailable");
      return true;
    });
  } finally {
    mock.restoreAll();
  }
});
