// Beacons referral program: the public leaderboard behind /leaderboard.
//
// This endpoint is read-only and needs no auth. It only ever returns the
// display name someone chose at sign-up plus how many people they referred;
// emails and raw referral codes never leave the Beacons backend. Anyone on
// zero referrals is left out of the response entirely, so an empty array is a
// perfectly normal "nobody has referred anyone yet" answer, not an error.
//
// The webhook URL and its secret key are a separate, server-side concern
// (Fillout -> Beacons). Neither belongs anywhere in this frontend.
export const LEADERBOARD_URL =
  "https://beacons-infra.kiwihacks.com/api/public/programs/bp_Y6H_EInJqCtRYQLB4u_Hmnqd/leaderboard";

export type LeaderboardEntry = {
  displayName: string;
  referralCount: number;
};

// One place on the board, held by everyone on the same referral count.
export type Band = {
  // Competition rank: 1, 2, then 4 if two people shared second.
  rank: number;
  referralCount: number;
  // In the order the API returned them.
  names: string[];
};

/**
 * Groups the list into one band per referral count.
 *
 * Referral counts are small integers, so ties are the norm rather than the
 * exception: a dozen people can sit on one referral each. Listing them as
 * separate placings would either repeat the same number a dozen times or
 * invent an order out of however Beacons happened to sort them. Banding says
 * the true thing instead — this is the place, this is the score, these are the
 * people who hold it.
 *
 * The API already sorts by referralCount descending, and that order is kept.
 */
export function toBands(entries: LeaderboardEntry[]): Band[] {
  const bands: Band[] = [];

  entries.forEach((entry, index) => {
    const current = bands[bands.length - 1];
    if (current && current.referralCount === entry.referralCount) {
      current.names.push(entry.displayName);
    } else {
      bands.push({
        rank: index + 1,
        referralCount: entry.referralCount,
        names: [entry.displayName],
      });
    }
  });

  return bands;
}
