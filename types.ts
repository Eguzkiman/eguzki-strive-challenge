export interface Quiz {
    id: number;
    name: string;
    questions: Question[];
    submissions: Question[];
}

export interface Question {
    id: number;
    quiz_id: number;
    text: string;
}

export interface Submission {
    id: number;
    name: string;
    answers: Answer[];
}

export interface Answer {
    id: number;
    text: string;
}