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
    this.questions = this.questions.filter((q) => q !== index);
    this.examQuestions = this.examQuestions.filter((_, i) => i !== index);
    // Reindex remaining questions
    this.questions = this.questions.map((_, i) => i);
  }

  onQuestionAdded(questionData: any, index: number): void {
    // Update the specific question at the given index
    this.examQuestions[index] = questionData;
  }

  formatQuestionData(question: any) {
    if (!question) return null;

    // Validate required fields
    if (
      !question.title ||
      !question.mark ||
      !question.questionType ||
      !question.correctAnswer
    ) {
      console.error('Missing required fields:', question);
      return null;
    }

    if (question.questionType === 'mcq') {
      const correctAnswer = Number(question.correctAnswer);
      if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
        console.error(
          'Invalid correct answer for MCQ:',
          question.correctAnswer
        );
        return null;
      }

      // Validate all MCQ options are present
      if (
        !question.option0 ||
        !question.option1 ||
        !question.option2 ||
        !question.option3
      ) {
        console.error('Missing MCQ options:', question);
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
      // True/False validation
      if (
        question.correctAnswer !== 'true' &&
        question.correctAnswer !== 'false'
      ) {
        console.error(
          'Invalid correct answer for True/False:',
          question.correctAnswer
        );
        return null;
      }

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
        (q) => q && q.title && q.questionType && q.mark && q.correctAnswer
      );

      if (validQuestions.length === 0) {
        console.error('No valid questions to submit');
        return;
      }

      const formattedQuestions = validQuestions
        .map((q) => this.formatQuestionData(q))
        .filter((q) => q !== null);

      if (formattedQuestions.length === 0) {
        console.error('No valid questions to submit after formatting');
        return;
      }

      // Validate each question has exactly one correct answer
      const invalidQuestions = formattedQuestions.filter(
        (q) => q.choices.filter((c) => c.isCorrect).length !== 1
      );

      if (invalidQuestions.length > 0) {
        console.error('Each question must have exactly one correct answer');
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
