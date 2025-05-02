import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../Services/exam.service';
import { Exam, Question } from '../../models/exam';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './take-exam.component.html',
  styleUrl: './take-exam.component.css',
})
export class TakeExamComponent implements OnInit {
  exam: Exam | null = null;
  answers: { questionIndex: number; selectedChoiceIndex: number }[] = [];
  score: number | null = null;
  errorMessage: string = '';
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    const examId = this.route.snapshot.paramMap.get('id');
    if (examId) {
      this.loadExam(examId);
    } else {
      this.errorMessage = 'Invalid exam ID';
    }
  }

  loadExam(id: string): void {
    this.examService.getExamById(id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.exam = response.data;
          this.initializeAnswers();
        } else {
          this.errorMessage =
            response.message || 'Failed to load exam. Please try another exam.';
        }
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message ||
          'Failed to load exam. Please check your connection or try again.';
      },
    });
  }

  initializeAnswers(): void {
    if (this.exam && this.exam.questions) {
      this.answers = this.exam.questions.map(
        (question: Question, index: number) => ({
          questionIndex: index,
          selectedChoiceIndex: -1,
        })
      );
    }
  }

  selectAnswer(questionIndex: number, choiceIndex: number): void {
    const answer = this.answers.find(
      (ans) => ans.questionIndex === questionIndex
    );
    if (answer) {
      answer.selectedChoiceIndex = choiceIndex;
    }
  }

  submitExam(): void {
    if (!this.exam) {
      this.errorMessage = 'Exam not loaded. Please try another exam.';
      return;
    }

    if (this.answers.some((ans) => ans.selectedChoiceIndex === -1)) {
      this.errorMessage = 'Please answer all questions';
      return;
    }

    this.examService.submitExam(this.exam._id, this.answers).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.score = response.data.score;
          this.submitted = true;
        } else {
          this.errorMessage = response.message || 'Failed to submit exam';
        }
      },
      error: (err) => {
        const message =
          err.error?.message || 'Failed to submit exam. Please try again.';
        if (message.includes('Please login')) {
          this.errorMessage = 'Your session has expired. Please login again.';
          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 2000);
        } else {
          this.errorMessage = message;
        }
      },
    });
  }

  goToResults(): void {
    this.router.navigate(['/results']);
  }
}
