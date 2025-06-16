export interface Choice {
  text: string;
  isCorrect?: boolean; // Optional because isCorrect won't be shown to the user
}

export interface Question {
  questionText: string;
  choices: Choice[];
  marks: number;
}

export interface Exam {
  _id: string;
  name: string;
  description: string;
  totalMarks: number;
  questionCount: number;
  submissionCount: number;
  questions: {
    questionText: string;
    marks: number;
    choices: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}
