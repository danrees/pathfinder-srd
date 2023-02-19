import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const addr = "https://pf2.d20pfsrd.com/monster/ghoul/";
const path = "./.cache/monster/ghoul.html";

try {
  const output = await Deno.stat(path);
  //const now = new Date();
  const compare = new Date().getTime() - 5 * 24 * 60 * 60 * 1000;
  if (output.mtime && output.mtime.getTime() < compare) {
    console.log("file is old, it should be regenerated");
  }
} catch (e) {
  if (e instanceof Deno.errors.NotFound) {
    console.log(`File ${path} not found in cache, writing`);
    const result = await fetch(addr);

    const html = await result.text();
    await Deno.writeTextFile(path, html);
  }
}
const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile(path);
const document = new DOMParser().parseFromString(
  decoder.decode(data),
  "text/html"
);
const article = document?.querySelector("div#article-content");

const title = article?.querySelector("h4.monster")?.textContent;
const levelBlock = article?.querySelector("span.level");
const monsterType = levelBlock?.querySelector("span.monster-type")?.textContent;
const monsterLevel =
  levelBlock?.querySelector("span.monster-level")?.textContent;

const traitsBlock = article?.querySelector("p.traits");
type Traits = {
  alignment: string;
  size: string;
  trait: string[];
};
const traits = {
  alignment: traitsBlock?.querySelector("span.alignment")?.textContent,
  size: traitsBlock?.querySelector("span.size")?.textContent,
  trait: Array.from(traitsBlock?.querySelectorAll("span.trait") || []).map(
    (t) => {
      return t.textContent;
    }
  ),
};

const details = Array.from(
  article?.querySelectorAll("p:not(.traits)") || []
).map((d) => {
  return d.textContent;
});

console.log(title);
console.log(`Type: ${monsterType} = ${monsterLevel}`);
console.log(traits);
console.log(details);
