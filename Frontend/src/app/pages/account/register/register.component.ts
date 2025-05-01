import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userData = { username: '', email: '', password: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting: boolean = false;
  fieldErrors: { [key: string]: string } = {};

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.fieldErrors = {};
    this.isSubmitting = true;

    if (
      !this.userData.username ||
      !this.userData.email ||
      !this.userData.password
    ) {
      this.errorMessage = 'All fields are required.';
      this.isSubmitting = false;
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.successMessage =
          'Registration successful! Redirecting to login page...';
        setTimeout(() => {
          this.router.navigate(['/account/login']);
        }, 1000);
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.error && err.error.code === 11000) {
          const field = Object.keys(err.error.keyValue)[0];

          if (field === 'username') {
            this.fieldErrors['username'] =
              'This username is already taken. Please choose another one.';
          } else if (field === 'email') {
            this.fieldErrors['email'] =
              'This email is already registered. Please use another email.';
          } else {
            this.errorMessage = 'This data is already registered.';
          }
        } else if (
          err.error &&
          err.error.message &&
          err.error.message.includes('User validation failed')
        ) {
          this.processValidationErrors(err.error.message);
        } else if (err.error && err.error.message) {
          this.errorMessage = this.simplifyErrorMessage(err.error.message);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }

  private processValidationErrors(errorMsg: string): void {
    const validationParts = errorMsg.split('User validation failed: ')[1];

    if (validationParts) {
      const errors = validationParts.split(', ');

      errors.forEach((error) => {
        const [field, message] = error.split(':').map((item) => item.trim());

        if (field === 'username') {
          this.fieldErrors['username'] = this.arabicError('Username', message);
        } else if (field === 'email') {
          this.fieldErrors['email'] = this.arabicError('Email', message);
        } else if (field === 'password') {
          this.fieldErrors['password'] = this.arabicError('Password', message);
        }
      });

      if (Object.keys(this.fieldErrors).length === 0) {
        this.errorMessage = this.simplifyErrorMessage(errorMsg);
      }
    } else {
      this.errorMessage =
        'Data validation failed. Please ensure all fields are correct.';
    }
  }

  private arabicError(fieldName: string, message: string): string {
    if (message.includes('required')) {
      return `${fieldName} is required.`;
    } else if (message.includes('min')) {
      return `${fieldName} must be at least 3 characters.`;
    } else if (message.includes('Invaild Email')) {
      return 'Invalid email format.';
    } else if (message.includes('Password must be')) {
      return 'Password must contain uppercase, lowercase, numbers, special characters, and be 8-20 characters long.';
    }
    return message;
  }

  private simplifyErrorMessage(message: string): string {
    if (message.includes('duplicate key error')) {
      return 'This data is already registered.';
    } else if (message.includes('Validator failed')) {
      return 'The entered data is invalid. Please check your inputs.';
    }

    return message.length < 100
      ? message
      : 'An error occurred during registration. Please try again.';
  }

  resetField(field: string): void {
    if (field === 'username') {
      this.userData.username = '';
    } else if (field === 'email') {
      this.userData.email = '';
    } else if (field === 'password') {
      this.userData.password = '';
    }

    if (this.fieldErrors[field]) {
      delete this.fieldErrors[field];
    }
  }
}
