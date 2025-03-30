import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { getMessage } from '../interfaces/getMessage.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)
  chats = [];

  baseApiUrl = 'http://localhost:5002/';

  getUserPrivateChats(){
    return this.http.get<[]>
    (
      `${this.baseApiUrl}chat/PrivateChat`,
      { withCredentials: true }
    )
  }

  cretaUserPrivateChats(joinUserId: number){
    return this.http.post<number>
    (
      `${this.baseApiUrl}chat/PrivateChat`,
      { joinUserId: joinUserId },
      { withCredentials: true }
    )
  }

  getChatMessages(chatId: number){
    return this.http.get<getMessage[]>
    (
      `${this.baseApiUrl}message/MessagesByChatId?chatId=${chatId}`,
      { withCredentials: true }
    )
  }

}
