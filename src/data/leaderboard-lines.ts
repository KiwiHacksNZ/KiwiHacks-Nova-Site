/*
 * The line under the referral total on /leaderboard.
 *
 * ---------------------------------------------------------------------------
 * EDITING THIS FILE
 *
 * Each tier applies from `from` sign-ups upward. The page finds the highest
 * tier the total has reached and shows one of its lines, picked at random on
 * every page load, so the same total reads differently each time.
 *
 * To change the wording, just edit the strings. To add a tier, add an object
 * with its own `from`. To retire one, delete it.
 *
 * The only two rules:
 *   1. Every tier needs at least one line.
 *   2. There must be a tier with `from: 1`, or a board with a single sign-up
 *      has nothing to show.
 *
 * Tiers do not need to be in order; the code sorts them.
 *
 * The total is only ever 0 when nobody has referred anyone, and the page shows
 * its "nobody's on the board yet" card instead, so a `from: 0` tier would
 * never appear.
 * ---------------------------------------------------------------------------
 */

export type HypeTier = {
  // Applies from this many sign-ups upward, until the next tier takes over.
  from: number;
  lines: string[];
};

export const HYPE_TIERS: HypeTier[] = [
  {
    from: 1,
    lines: [
      "please. speed. i need this.",
      "we are refreshing this page more often than you are.",
      "we have told our parents it is going well.",
      "statistically, you know someone. statistically.",
      "kevin is watching.",
    ],
  },
  {
    from: 5,
    lines: [
      "the group chat is doing something.",
      "we have stopped checking every ten minutes. mostly.",
      "enough to fill a table. a small table.",
      "this is a number now. it was not a number before.",
      "idk what kevin is doing.",
    ],
  },
  {
    from: 15,
    lines: [
      "the spreadsheet has a second page.",
      "an organiser has said the word logistics out loud.",
      "enough for a proper queue at the pizza.",
      "we have started describing the venue as cosy.",
      "kevin has started paying attention.",
    ],
  },
  {
    from: 30,
    lines: [
      "we ordered the pizza on the strength of this number. do not make us wrong.",
      "the venue booking has gone from optimistic to smug.",
      "somebody has drawn a seating plan. it is not going well.",
      "we are printing more name tags. this is a real sentence we typed.",
      "kevin finds this number interesting.",
    ],
  },
  {
    from: 60,
    lines: [
      "we are short on chairs, tables and composure.",
      "the whiteboard is full. we have moved onto a window.",
      "this has stopped being a number and started being a problem. a good problem.",
      "we are so cooked. keep going.",
      "kevin's call is important to you.",
    ],
  },
  {
    from: 100,
    lines: [
      "one hundred. an organiser has been sent home to sleep.",
      "the venue has been informed. the venue is coping.",
      "at this point just bring the entire school.",
      "we have run out of ways to say thank you, so: thanks.",
      "kevin is impressed. which is unusual. kevin is never impressed.",
    ],
  },
];

/**
 * The line for a given total: the highest tier it has reached, then one of
 * that tier's lines at random.
 *
 * `pick` is only there so the choice can be made predictable in a test.
 */
export function hypeLine(total: number, pick: () => number = Math.random) {
  const [tier] = HYPE_TIERS.filter((t) => total >= t.from).sort(
    (a, b) => b.from - a.from,
  );
  if (!tier || tier.lines.length === 0) return "";
  return tier.lines[Math.floor(pick() * tier.lines.length)] ?? tier.lines[0];
}
