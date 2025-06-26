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

/**
 * 利用可能なデータセットの情報を返す
 * @returns データセット情報の配列
 */
export function getAvailableDatasets() {
  return [
    { 
      id: '英単語カード.tsv', 
      title: '英単語カード', 
      description: '基本的な英単語を学ぶためのフラッシュカード', 
      category: '英語学習' 
    },
    { 
      id: '日常会話問答カード.tsv', 
      title: '日常会話問答カード', 
      description: '日常会話で使える英語表現を学ぶためのカード', 
      category: '会話' 
    },
    { 
      id: '場面別会話カード.tsv', 
      title: '場面別会話カード', 
      description: '様々な場面で役立つ英語表現を学ぶためのカード', 
      category: '会話' 
    }
  ];
}
