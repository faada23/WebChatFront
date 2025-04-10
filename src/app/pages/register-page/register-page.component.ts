import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.Service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  router = inject(Router)
  
  showError = false;
  errorMessage = '';

  form = new FormGroup({
    password: new FormControl<string | null>(null,Validators.required),
    username: new FormControl<string | null>(null,Validators.required)
  })

  onSubmit(){
    if(this.form.valid){
      //@ts-ignore 
      this.authService.register(this.form.value).pipe(
        tap(() => {
          this.router.navigate(['/login'])
        }),
        catchError(() =>{
          this.showNotification("error while creating account")
          return of();
        })
      )
      .subscribe()
    
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

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
