import { inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ProfileService } from './profile.service';
import { getChat } from '../interfaces/getChat.interface';
import { getMessage } from '../interfaces/getMessage.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  profileService = inject(ProfileService);
  hubConnection: HubConnection | null  = null;

  constructor() {
    this.createConnection();
    this.startConnection()
  }

  private getChats(){
    this.profileService.getUserPrivateChats()
      .pipe(
        tap(chats => {
          this.JoinChats(chats);
        })
      )
      .subscribe();
  }

  private createConnection(){
    const url = 'http://localhost:5002/chathub';
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(url, {withCredentials: true})
    .build();

  } 
  
  private startConnection(){
    this.hubConnection
    ?.start()
    .then(() => this.getChats())
    .catch(err => console.log('Error while starting connection: ' + err));
  }

  private JoinChats(chats: getChat[]){
    chats.forEach(element => {
      this.joinChat(element.id)
    });
  }

  public joinChat(chatId: number) {
     this.hubConnection?.invoke('JoinChat', chatId);
  }

  sendMessage(chatId: number, text: string) {
    this.hubConnection?.invoke('SendMessage', chatId, text);
  }


  
  
}