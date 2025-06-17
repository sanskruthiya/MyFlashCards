import Papa from 'papaparse';
import type { Flashcard } from './types';

/**
 * TSVファイルからフラッシュカードデータを読み込む
 * @param filePath TSVファイルのパス
 * @returns フラッシュカードの配列を含むPromise
 */
export async function loadFlashcardsFromTSV(filePath: string): Promise<Flashcard[]> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        delimiter: '\t', // タブ区切りを指定
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cards = results.data as Flashcard[];
          resolve(cards);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading flashcards:', error);
    throw error;
  }
}

// 後方互換性のために古い関数名も残しておく
export const loadFlashcardsFromCSV = loadFlashcardsFromTSV;

/**
 * フラッシュカードをシャッフルする
 * @param cards シャッフルするカードの配列
 * @returns シャッフルされたカードの配列
 */
export function shuffleCards(cards: Flashcard[]): Flashcard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
