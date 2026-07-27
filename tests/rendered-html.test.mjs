import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
    /<title>StarSpark Live — Creator Adventure · StarSpark Live<\/title>/i,
  );
  assert.match(html, /StarSpark/);
  assert.match(html, /Customise your creator\. Build your profile\. Light up the live!/);
  assert.match(html, /A kid-safe creator adventure/i);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("includes the creator journey and kid-safe live systems", async () => {
  const source = await readFile(
    new URL("../app/StarSparkGame.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /CREATE YOUR STAR/);
  assert.match(source, /View my profile/);
  assert.match(source, /Performance snapshots saved after every live/);
  assert.match(source, /Kid-safe comment moderation/);
  assert.match(source, /bubble-pop-loop\.mp3/);
  assert.match(source, /sylhet-bangladesh\.mp3/);
});

test("includes the milestone wardrobe and live style boosts", async () => {
  const gameSource = await readFile(
    new URL("../app/StarSparkGame.tsx", import.meta.url),
    "utf8",
  );
  const characterSource = await readFile(
    new URL("../app/ZoeCharacter.tsx", import.meta.url),
    "utf8",
  );

  assert.match(gameSource, /Full wardrobe/);
  assert.match(gameSource, /Rainbow Twirl/);
  assert.match(gameSource, /Crown Braid/);
  assert.match(gameSource, /Wardrobe boost applied/);
  assert.match(gameSource, /wardrobeViewBoost/);
  assert.match(gameSource, /wardrobeLikeBoost/);
  assert.match(characterSource, /data-hair/);
  assert.match(characterSource, /data-makeup/);
  assert.match(characterSource, /zoe-skirt/);
});

test("includes kid-safe split-screen NPC creator battles", async () => {
  const gameSource = await readFile(
    new URL("../app/StarSparkGame.tsx", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const rivalSource = await readFile(
    new URL("../app/RivalCharacter.tsx", import.meta.url),
    "utf8",
  );

  assert.match(gameSource, /BATTLE_RIVALS/);
  assert.match(gameSource, /Battle invitation accepted/);
  assert.match(gameSource, /battlePlayerScore/);
  assert.match(gameSource, /battleRivalScore/);
  assert.match(gameSource, /Battle again/);
  assert.match(styles, /\.battle-scoreboard/);
  assert.match(styles, /\.battle-rival-zone/);
  assert.match(styles, /\.battle-mode/);
  assert.match(gameSource, /RivalCharacter/);
  assert.match(rivalSource, /rival-remy/);
  assert.match(rivalSource, /rival-luna/);
  assert.match(rivalSource, /rival-kiki/);
  assert.match(rivalSource, /rival-sunny/);
  assert.match(styles, /\.battle-step-a/);
  assert.match(styles, /contain: layout paint style/);
  assert.match(styles, /\.customization-screen/);
});
