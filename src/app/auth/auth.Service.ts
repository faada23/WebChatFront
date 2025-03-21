import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  cookieService = inject(CookieService)
  router = inject(Router)
  baseApiUrl = 'http://localhost:5002/Auth/';

  token: string | null = null

  get isAuth(){
    if(!this.token){
      this.token = this.cookieService.get('JwtCookie')
    }
    return !!this.token
  }

  login(payload: {username: string, password: string})
  {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);

    return this.http.post(
        `${this.baseApiUrl}Login`, fd, { withCredentials: true }
      );
    }
}