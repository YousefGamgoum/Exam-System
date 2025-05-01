import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionComponent } from '../../Components/question/question.component';

interface Choice {
  text: string;
  isCorrect: boolean;
  _id: string;
}

interface Question {
  questionText: string;
  choices: Choice[];
  marks: number;
  _id: string;
}

interface Exam {
  _id: string;
  name: string;
  description: string;
  questions: Question[];
  totalMarks: number;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  data: Exam;
}

@Component({
  selector: 'app-update-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuestionComponent],
  templateUrl: './update-exam.component.html',
  styleUrl: './update-exam.component.css',
})
export class UpdateExamComponent implements OnInit {
  examForm: FormGroup;
  questions: number[] = [0];
  examQuestions: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  examId: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      examTitle: ['', [Validators.required, Validators.minLength(3)]],
      examDescription: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.examId = params['id'];
      this.fetchExamData();
    });
  }

  fetchExamData() {
    this.http
      .get<ApiResponse>(`http://localhost:3000/exams/${this.examId}/exam`)
      .subscribe({
        next: (response) => {
          const exam = response.data;
          this.examForm.patchValue({
            examTitle: exam.name,
            examDescription: exam.description,
          });

          // Reset questions array
          this.questions = [];
          this.examQuestions = [];

          // Add questions
          exam.questions.forEach((question, index) => {
            this.questions.push(index);
            const correctAnswerIndex = question.choices.findIndex(
              (choice) => choice.isCorrect
            );

            this.examQuestions[index] = {
              title: question.questionText,
              mark: question.marks,
              questionType: question.choices.length === 2 ? 'trueFalse' : 'mcq',
              correctAnswer:
                question.choices.length === 2
                  ? correctAnswerIndex === 0
                    ? 'true'
                    : 'false'
                  : correctAnswerIndex.toString(),
              option0: question.choices[0].text,
              option1: question.choices[1].text,
              option2: question.choices[2]?.text || '',
              option3: question.choices[3]?.text || '',
            };
          });

          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch exam data';
          this.loading = false;
          console.error('Error fetching exam data:', err);
        },
      });
  }

  addQuestion(): void {
    const newIndex = this.questions.length;
    this.questions.push(newIndex);
    // Initialize new question with default values
    this.examQuestions[newIndex] = {
      title: '',
      mark: '',
      questionType: '',
      correctAnswer: '',
      option0: '',
      option1: '',
      option2: '',
      option3: '',
    };
  }

  deleteQuestion(index: number): void {
    // Remove the question at the specified index
    this.questions = this.questions.filter((q) => q !== index);
    this.examQuestions = this.examQuestions.filter((_, i) => i !== index);

    // Reindex remaining questions
    this.questions = this.questions.map((_, i) => i);

    // Reindex examQuestions to match the new indices
    const reindexedQuestions = [];
    for (let i = 0; i < this.questions.length; i++) {
      reindexedQuestions[i] = this.examQuestions[this.questions[i]];
    }
    this.examQuestions = reindexedQuestions;
  }

  onQuestionAdded(questionData: any, index: number): void {
    // Update the specific question at the given index
    this.examQuestions[index] = questionData;
  }

  formatQuestionData(question: any) {
    if (!question) return null;

    if (question.questionType === 'mcq') {
      const correctAnswer = Number(question.correctAnswer);
      if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
        console.error(
          'Invalid correct answer for MCQ:',
          question.correctAnswer
        );
        return null;
      }

      return {
        questionText: question.title,
        marks: Number(question.mark),
        choices: [
          { text: question.option0, isCorrect: correctAnswer === 0 },
          { text: question.option1, isCorrect: correctAnswer === 1 },
          { text: question.option2, isCorrect: correctAnswer === 2 },
          { text: question.option3, isCorrect: correctAnswer === 3 },
        ],
      };
    } else {
      const isTrueCorrect = question.correctAnswer === 'true';
      return {
        questionText: question.title,
        marks: Number(question.mark),
        choices: [
          { text: 'True', isCorrect: isTrueCorrect },
          { text: 'False', isCorrect: !isTrueCorrect },
        ],
      };
    }
  }

  onSubmit(): void {
    if (this.examForm.valid && this.examQuestions.length > 0) {
      // Filter out any undefined or null questions
      const validQuestions = this.examQuestions.filter(
        (q) => q && q.title && q.questionType
      );

      if (validQuestions.length === 0) {
        this.error = 'No valid questions to submit';
        return;
      }

      const formattedQuestions = validQuestions
        .map((q) => this.formatQuestionData(q))
        .filter((q) => q !== null);

      if (formattedQuestions.length === 0) {
        this.error = 'No valid questions to submit';
        return;
      }

      // Validate each question has exactly one correct answer
      const invalidQuestions = formattedQuestions.filter(
        (q) => q.choices.filter((c) => c.isCorrect).length !== 1
      );

      if (invalidQuestions.length > 0) {
        this.error = 'Each question must have exactly one correct answer';
        return;
      }

      const examData = {
        name: this.examForm.get('examTitle')?.value,
        description: this.examForm.get('examDescription')?.value,
        questions: formattedQuestions,
      };

      this.http
        .put(`http://localhost:3000/exams/${this.examId}`, examData)
        .subscribe({
          next: (response) => {
            console.log('Exam updated successfully:', response);
            this.router.navigate(['/exams']);
          },
          error: (error) => {
            console.error('Error updating exam:', error);
            this.error = error.error?.message || 'Failed to update exam';
          },
        });
    }
  }
}
