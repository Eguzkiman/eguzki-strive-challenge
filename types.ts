export interface Quiz {
    id: number;
    name: string;
    questions: Question[];
}

export interface Question {
    id: number;
    quiz_id: number;
    text: string;
}