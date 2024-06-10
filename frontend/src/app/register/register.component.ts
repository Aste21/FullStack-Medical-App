import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SignupInfo } from '../auth/signup-info';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: any = {
    username: null,
    password: null,
    name: null,
    surname: null,
    email: null
  };
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    const { username, password, name, surname, email } = this.form;
    const signupInfo = new SignupInfo(username, password, name, surname, email, ['user']); // Assuming role is user

    this.authService.signUp(signupInfo).subscribe({
      next: data => {
        console.log(data);
        this.isSignedUp = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignedUp = false;
        this.isSignUpFailed = true;
      }
    });
  }
}
