import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userData = { username: '', email: '', password: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.successMessage =
          'Registration successful! Redirecting to login...';
      },
      error: (err) => {
        this.errorMessage =
          err.error.message || 'Registration failed. Please try again.';
      },
    });
  }
}
