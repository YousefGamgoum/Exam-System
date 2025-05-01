import { Component, OnInit } from '@angular/core';
import { QuestionComponent } from '../../Components/question/question.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExamService } from '../../Services/exam.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [QuestionComponent, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-exam.component.html',
  styleUrl: './create-exam.component.css',
})
export class CreateExamComponent implements OnInit {
  questions: number[] = [0]; // Array to track question indices
  examQuestions: any[] = []; // Array to store question data
  examForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      examTitle: ['', [Validators.required, Validators.minLength(3)]],
      examDescription: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // Initialize any additional setup if needed
  }

  addQuestion(): void {
    const newIndex = this.questions.length;
    this.questions.push(newIndex);
  }

  deleteQuestion(index: number): void {
    this.questions = this.questions.filter((q) => q !== index);
    this.examQuestions = this.examQuestions.filter((_, i) => i !== index);
    // Reindex remaining questions
    this.questions = this.questions.map((_, i) => i);
  }

  onQuestionAdded(questionData: any): void {
    const questionIndex = this.questions.length - 1;
    this.examQuestions[questionIndex] = questionData;
  }

  formatQuestionData(question: any) {
    if (!question) return null;

    if (question.questionType === 'mcq') {
      return {
        questionText: question.title,
        marks: question.mark,
        choices: [
          { text: question.option0, isCorrect: question.correctAnswer === 0 },
          { text: question.option1, isCorrect: question.correctAnswer === 1 },
          { text: question.option2, isCorrect: question.correctAnswer === 2 },
          { text: question.option3, isCorrect: question.correctAnswer === 3 },
        ],
      };
    } else {
      return {
        questionText: question.title,
        marks: question.mark,
        choices: [
          { text: 'True', isCorrect: question.correctAnswer === 'true' },
          { text: 'False', isCorrect: question.correctAnswer === 'false' },
        ],
      };
    }
  }

  onSubmit(): void {
    if (this.examForm.valid && this.examQuestions.length > 0) {
      const formattedQuestions = this.examQuestions
        .map((q) => this.formatQuestionData(q))
        .filter((q) => q !== null);

      if (formattedQuestions.length === 0) {
        console.error('No valid questions to submit');
        return;
      }

      const examData = {
        name: this.examForm.get('examTitle')?.value,
        description: this.examForm.get('examDescription')?.value,
        questions: formattedQuestions,
      };

      console.log('Sending exam data:', examData);

      this.examService.createExam(examData).subscribe({
        next: (response) => {
          console.log('Exam created successfully:', response);
          this.router.navigate(['/exams']);
        },
        error: (error) => {
          console.error('Error creating exam:', error);
          console.error('Error details:', error.error);
        },
      });
    }
  }
}
