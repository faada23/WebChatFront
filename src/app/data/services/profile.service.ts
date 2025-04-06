import { HttpClient } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { getMessage } from '../interfaces/getMessage.interface';
import { PagedResponse } from '../interfaces/PagedResponse.interface';
import { getChat } from '../interfaces/getChat.interface';
import { getUser } from '../interfaces/getUser.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)

  baseApiUrl = 'http://localhost:5002/';

  getUserPrivateChats(pageNumber: number = 1, pageSize: number = 20) {
    return this.http.get<PagedResponse<getChat>>(
      `${this.baseApiUrl}chat/PrivateChat?Page=${pageNumber}&PageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  createUserPrivateChat(joinUserId: number){
    return this.http.post
    (
      `${this.baseApiUrl}chat/PrivateChat?joinUserId=${joinUserId}`,
      {}, 
      { withCredentials: true }
    );
  }

  getChatMessages(chatId: number, pageNumber: number = 1, pageSize: number = 50) {
    return this.http.get<PagedResponse<getMessage>>(
      `${this.baseApiUrl}message/Messages/${chatId}?Page=${pageNumber}&PageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  getUsers(filter: string | null = null, pageNumber: number = 1, pageSize: number = 50){
    return this.http.get<PagedResponse<getUser>>(
      `${this.baseApiUrl}user/Users?filter=${filter}&Page=${pageNumber}&PageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

}
