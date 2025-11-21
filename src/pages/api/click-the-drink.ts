import type { APIRoute } from "astro";
import {
  saveClickTheDrink,
  getLeaderboardClickTheDrink,
} from "../../libs/firebase-firestore";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const { playerName, strike } = body;

  const ok = await saveClickTheDrink({ playerName, strike });

  return new Response(JSON.stringify({ success: ok }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const GET: APIRoute = async () => {
  const leaderboard = await getLeaderboardClickTheDrink(10);
  return new Response(JSON.stringify({ leaderboard }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
