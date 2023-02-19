import { assertEquals } from "https://deno.land/std@0.163.0/testing/asserts.ts";

import { parseSenses, parseStats, parseList, myStatBlock } from "./parser.ts";

Deno.test("Basic skill", async (t) => {
  await t.step("Test positive", () => {
    const output = parseStats("Perception +5");
    assertEquals(output, ["Perception", "+5"]);
  });
  await t.step("Test negative", () => {
    const output = parseStats("Perception -5");
    assertEquals(output, ["Perception", "-5"]);
  });
});

Deno.test(function testList() {
  const output = parseList("Thing 1, Thing 2");
  assertEquals(output, ["Thing 1", "Thing 2"]);
});

Deno.test(function testLanguages() {
  const output = myStatBlock.Languages.tryParse("Languages Common, Draconic");
  assertEquals(output, ["Languages", ["Common", "Draconic"]]);
});

Deno.test(function testSkills() {
  const output = myStatBlock.Skills.tryParse(
    "Skills Acrobatics +7, Diplomacy +1"
  );
  assertEquals(output, [
    "Skills",
    [
      ["Acrobatics", "+7"],
      ["Diplomacy", "+1"],
    ],
  ]);
});

Deno.test(function basicSenses() {
  const output = parseSenses("Senses Perception +5; darkvision");
  assertEquals(output, [
    "Senses",
    " ",
    ["Perception", "+5"],
    " ",
    "darkvision",
  ]);
});

Deno.test(function testAbilities() {
  const output = myStatBlock.Abilities.tryParse("Str +1, Dex +2, Con -1");
  assertEquals(output, [
    ["Str", "+1"],
    ["Dex", "+2"],
    ["Con", "-1"],
  ]);
});

Deno.test("test ac", () => {
  const output = myStatBlock.AC.tryParse("AC 20;");
  assertEquals(output, ["AC", "20"]);
});

Deno.test("test health", () => {
  const output = myStatBlock.Health.tryParse("HP 20, negative Healing");
  assertEquals(output, [
    ["HP", "20"],
    ["negative", "Healing"],
  ]);
});
