import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  http = inject(HttpClient);
  router = inject(Router)
  baseApiUrl = 'http://localhost:5002/Auth/';

  login(payload: {username: string, password: string})
  {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);

    return this.http.post(
        `${this.baseApiUrl}Login`, fd, { withCredentials: true }
      )
  }
}