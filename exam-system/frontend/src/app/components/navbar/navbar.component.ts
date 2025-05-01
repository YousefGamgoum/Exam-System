import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  userRole: string | null = localStorage.getItem('role'); // قيمة ابتدائية من localStorage
  private loginSubscription!: Subscription;
  private roleSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // نشترك في حالة الـ login
    this.loginSubscription = this.authService
      .getLoggedInStatus()
      .subscribe((status: boolean) => {
        this.loggedIn = status;
        console.log('LoggedIn status:', this.loggedIn);
        // نحدّث الـ role يدويًا بعد كل تغيير في حالة الـ login
        this.userRole = localStorage.getItem('role');
        console.log('UserRole after login status change:', this.userRole);
      });

    // نشترك في الـ role
    this.roleSubscription = this.authService
      .getUserRole()
      .subscribe((role: string | null) => {
        this.userRole = role;
        console.log('UserRole updated from subscription:', this.userRole);
      });
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.userRole = null; // نحدّث الـ userRole يدويًا بعد الـ logout
    this.router.navigate(['/account/login']);
  }
}
