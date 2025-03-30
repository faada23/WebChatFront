import { inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { catchError, throwError } from 'rxjs';
import { ProfileService } from './profile.service';
import { getChat } from '../interfaces/getChat.interface';
import { getMessage } from '../interfaces/getMessage.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  profileService = inject(ProfileService);
  hubConnection: HubConnection | null  = null;
  chats: getChat[] = [];

  constructor() {
    this.createConnection();
    this.startConnection();
    this.getChats();
  }

  private getChats(){
    this.profileService.getUserPrivateChats().subscribe(chats => {this.chats  = chats});
    this.JoinChats(this.chats);
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
    .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection?.on('ReceiveMessage', (message: getMessage) => {
      console.log(`${message.content}`);
  });

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