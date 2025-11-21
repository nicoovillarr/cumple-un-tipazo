import { app } from "../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export type KahootResult = {
  playerName: string;
  score: number;
  answers: {
    question: string;
    answer: string;
    usedTime: number;
    isCorrect: boolean;
  }[];
};

export type ClickTheDrinkResult = {
  playerName: string;
  strike: number;
};

export const saveClickTheDrink = async ({
  playerName,
  strike,
}: ClickTheDrinkResult) => {
  if (!playerName || playerName.trim().length === 0) return false;

  try {
    const db = getFirestore(app);
    const clickTheDrinkScoresRef = db.collection("clickTheDrinkScores");
    await clickTheDrinkScoresRef.add({
      playerName,
      strike,
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
    .orderBy("strike", "desc")
    .limit(limit);
  const snapshot = await clickTheDrinkScoresRef.get();

  const results: { playerName: string; strike: number }[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    results.push({
      playerName: data.playerName,
      strike: data.strike,
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
