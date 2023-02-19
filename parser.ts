// @deno-types="npm:@types/parsimmon"
import P from "npm:parsimmon";

export const myStatBlock = P.createLanguage({
  SkillModifier: (r) => {
    return P.seq(r.Skill.skip(r._), r.Modifier);
  },
  Modifier: () => {
    return P.regexp(/[\+-][0-9]+/);
  },
  Skill: (r) => {
    return P.regexp(/^([A-Z][a-z]+\w?)+/).lookahead(P.seq(r._, r.Modifier));
  },
  Score: () => {
    return P.digits;
  },

  // TODO: Need to find examples of other 'senses' to make sure there isn't more
  Senses: (r) => {
    return P.seq(
      P.string("Senses"),
      r._,
      r.SkillModifier.skip(P.string(";")),
      r._,
      P.letters
    );
  },
  SkillList: (r) => {
    return P.alt(r.SkillModifier, P.regexp(/^[A-Za-z0-9\ ]+/)).sepBy(
      P.string(",").skip(P.optWhitespace)
    );
  },
  Languages: (r) => {
    return P.seq(P.string("Languages").skip(r._), r.List);
  },
  Skills: (r) => {
    return P.seq(P.string("Skills").skip(r._), r.List);
  },
  Abilities: (r) => {
    return r.List;
  },
  AC: (r) => {
    return P.seq(P.string("AC").skip(r._), P.digits).skip(P.string(";"));
  },
  HP: (r) => {
    return P.seq(P.string("HP").skip(r._), P.digits);
  },
  Health: (r) => {
    return P.sepBy(
      P.alt(r.HP, P.sepBy(P.letters, P.whitespace)),
      P.string(",").skip(r._)
    );
  },
  Speed: () => {
    return P.string("Speed");
  },
  Items: () => {
    return P.string("Items");
  },
  ActionDescription: () => {
    return P.seq(P.string("["), P.regexp(/[A-Za-z\-]+/), P.string("]"));
  },
  _: () => {
    return P.optWhitespace;
  },
});

export function parseStats(input: string) {
  return myStatBlock.SkillModifier.tryParse(input);
}

export function parseList(input: string) {
  return myStatBlock.SkillList.tryParse(input);
}

export function parseSenses(input: string) {
  return myStatBlock.Senses.tryParse(input);
}
