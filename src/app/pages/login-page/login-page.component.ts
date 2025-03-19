import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  //authService = inject(AuthService);
  router = inject(Router)
  
  form = new FormGroup({
    password: new FormControl<string | null>(null,Validators.required),
    username: new FormControl<string | null>(null,Validators.required)
  })

  onSubmit(){
    if(this.form.valid){
      
    }    
}
}
