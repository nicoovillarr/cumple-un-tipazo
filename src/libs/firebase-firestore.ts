import { app } from "../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const saveClickTheDrink = async ({
  playerName,
  count,
}: {
  playerName: string;
  count: number;
}) => {
  if (!playerName || playerName.trim().length === 0) return false;

  try {
    const db = getFirestore(app);
    const clickTheDrinkScoresRef = db.collection("clickTheDrinkScores");
    await clickTheDrinkScoresRef.add({
      playerName,
      count,
    });
  } catch (error) {
    return false;
  }

  return true;
};

export const getLeaderboardClickTheDrink = async (limit: number) => {
  const db = getFirestore(app);
  const clickTheDrinkScoresRef = db
    .collection("clickTheDrinkScores")
    .orderBy("count", "desc")
    .limit(limit);
  const snapshot = await clickTheDrinkScoresRef.get();

  const results: { playerName: string; count: number }[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    results.push({
      playerName: data.playerName,
      count: data.count,
    });
  });

  return results;
};
