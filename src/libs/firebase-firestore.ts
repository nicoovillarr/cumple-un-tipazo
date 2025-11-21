import { app } from "../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export type KahootResult = {
  playerName: string;
  score: number;
  answers: { question: string; answer: string }[];
};

export type ClickTheDrinkResult = {
  playerName: string;
  count: number;
};

export const saveClickTheDrink = async ({
  playerName,
  count,
}: ClickTheDrinkResult) => {
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

export const getLeaderboardClickTheDrink = async (
  limit: number
): Promise<ClickTheDrinkResult[]> => {
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

export const saveKahootResult = async (result: KahootResult) => {
  if (!result.playerName || result.playerName.trim().length === 0) return false;
  try {
    const db = getFirestore(app);
    const kahootResultsRef = db.collection("kahootResults");
    await kahootResultsRef.add(result);
  } catch (error) {
    return false;
  }

  return true;
};

export const getLeaderboardKahoot = async (
  limit: number
): Promise<KahootResult[]> => {
  const db = getFirestore(app);
  const kahootResultsRef = db
    .collection("kahootResults")
    .orderBy("score", "desc")
    .limit(limit);
  const snapshot = await kahootResultsRef.get();
  const results: KahootResult[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    results.push({
      playerName: data.playerName,
      score: data.score,
      answers: data.answers,
    });
  });

  return results;
};
