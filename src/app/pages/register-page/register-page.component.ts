import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.Service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  router = inject(Router)
  
  form = new FormGroup({
    password: new FormControl<string | null>(null,Validators.required),
    username: new FormControl<string | null>(null,Validators.required)
  })

  onSubmit(){
    if(this.form.valid){
      //@ts-ignore 
      this.authService.register(this.form.value).subscribe(
        () => {
          this.router.navigate(['/login'])
        })
    }    
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
}
}
