export interface RatingInterface {
    id: number; // ID ของการให้คะแนน
    score: number; // คะแนน (เช่น 1-5)
    comment?: string; // คอมเมนต์เกี่ยวกับการให้คะแนน
    poster_user_id: number;
    booker_user_id: number;
}