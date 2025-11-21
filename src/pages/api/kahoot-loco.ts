import type { APIRoute } from "astro";
import {
  saveKahootResult,
  getLeaderboardKahoot,
} from "../../libs/firebase-firestore";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const { playerName, score, answers } = body;

  const ok = await saveKahootResult({ playerName, score, answers });

  return new Response(JSON.stringify({ success: ok }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const GET: APIRoute = async () => {
  const leaderboard = await getLeaderboardKahoot(10);
  return new Response(JSON.stringify({ leaderboard }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
