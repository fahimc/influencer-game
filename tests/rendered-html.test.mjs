import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://starspark.test/", {
      headers: { accept: "text/html", host: "starspark.test" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the StarSpark game shell and social metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>StarSpark Live — Rhythm Combo Game · StarSpark Live<\/title>/i,
  );
  assert.match(html, /StarSpark/);
  assert.match(html, /Light up the live!/);
  assert.match(html, /Start show/);
  assert.match(html, /Pick Zoe(?:&apos;|&#x27;|')s live outfit/i);
  assert.match(html, /CREATOR MILESTONES/i);
  assert.match(html, /Kid-safe comment moderation/i);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
