export interface Flashcard {
  question: string;
  answer: string;
  note: string;
  category?: string; // カテゴリー情報を追加
  isFlipped?: boolean;
}
