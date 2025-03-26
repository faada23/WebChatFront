import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)
  chats = [];

  baseApiUrl = 'http://localhost:5002/';

  getUserChats(){
    return this.http.get<[]>
    (
      `${this.baseApiUrl}chat/UserChats`,
      { withCredentials: true }
    )
  }

}
