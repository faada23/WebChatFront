import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  hubConnection: HubConnection | null  = null;

  constructor() {
    this.createConnection();
    this.startConnection();
  }

  private createConnection(){
    const url = 'http://localhost:5002/chathub';
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(url)
    .build();

    this.hubConnection.on('RecieveMessage', (user: string, message: string) => {
        console.log('User: ${user}, Message: ${message}');
    });
  } 
  
  private startConnection(){
    this.hubConnection
    ?.start()
    .then(() => console.log('Connection started'))
    .catch(err => console.log('Error while starting connection: ' + err))
  }

  public sendMessage(user: string, message: string){
    this.hubConnection?.invoke('SendMessage', user, message)
        .catch(err => console.log(err))
  }
}