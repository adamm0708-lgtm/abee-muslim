export type Dua = {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  category: string;
  status: string; // "Shahih" | "Hasan" | "Dhaif" | "Doa umum"
  note: string;
};
