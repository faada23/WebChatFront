import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.Service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router)
  
  showError = false;
  errorMessage = '';

  form = new FormGroup({
    password: new FormControl<string | null>(null,Validators.required),
    username: new FormControl<string | null>(null,Validators.required)
  })

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore 
      this.authService.login(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error) => {
          if (error.status === 500) {
            this.showNotification('Invalid username or password.');
          } else {
            this.showNotification('Server error. Please try again later.');
          }
        }
      });
    }
    else{
      this.showNotification('Invalid data.');
    } 
  }

  private showNotification(message: string) {
    this.errorMessage = message;
    this.showError = true;
  
    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  navigateToRegister() {
    this.router.navigate(['/register']); 
}
}
