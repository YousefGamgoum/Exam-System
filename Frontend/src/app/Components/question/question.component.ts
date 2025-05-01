import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class QuestionComponent implements OnInit {
  @Output() questionAdded = new EventEmitter<any>();
  questionForm: FormGroup;
  mcqOptions = [0, 1, 2, 3];

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      mark: ['', [Validators.required, Validators.min(1)]],
      questionType: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      option0: [''],
      option1: [''],
      option2: [''],
      option3: [''],
    });
  }

  ngOnInit(): void {
    // Subscribe to form value changes
    this.questionForm.valueChanges.subscribe(() => {
      if (this.questionForm.valid) {
        const formValue = this.questionForm.value;
        // Only emit if all required fields are filled
        if (formValue.questionType === 'mcq') {
          const hasAllOptions = [
            'option0',
            'option1',
            'option2',
            'option3',
          ].every(
            (option) => formValue[option] && formValue[option].trim() !== ''
          );
          if (hasAllOptions && formValue.correctAnswer !== '') {
            this.questionAdded.emit(formValue);
          }
        } else if (
          formValue.questionType === 'trueFalse' &&
          formValue.correctAnswer !== ''
        ) {
          this.questionAdded.emit(formValue);
        }
      }
    });
  }

  onQuestionTypeChange(): void {
    const questionType = this.questionForm.get('questionType')?.value;
    // Reset correct answer when type changes
    this.questionForm.patchValue({ correctAnswer: '' });

    // Update validators for MCQ options
    if (questionType === 'mcq') {
      ['option0', 'option1', 'option2', 'option3'].forEach((option) => {
        this.questionForm.get(option)?.setValidators([Validators.required]);
        this.questionForm.get(option)?.updateValueAndValidity();
      });
    } else {
      ['option0', 'option1', 'option2', 'option3'].forEach((option) => {
        this.questionForm.get(option)?.clearValidators();
        this.questionForm.get(option)?.updateValueAndValidity();
        this.questionForm.get(option)?.setValue('');
      });
    }
  }
}
