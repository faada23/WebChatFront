import { Component, inject, NgModule} from '@angular/core';
import { SidebarComponent } from "../../common-ui/sidebar/sidebar.component";
import { ChatService } from '../../data/services/chat.service';
import { getMessage } from '../../data/interfaces/getMessage.interface';
import { NgForOf } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  selector: 'app-chat',
  imports: [SidebarComponent, NgForOf, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})

export class ChatPageComponent{
  profileService = inject(ProfileService);

  public user: string = '';
  public message: string = '';
  public messages: getMessage[] = []; 
  public chats: any[] = [];
  public selectedChatId: number |null = null;



  constructor(private chatService: ChatService)
  { 
    this.profileService.getUserPrivateChats().subscribe(chats => {this.chats = chats});
    
    if (this.chatService.hubConnection) {
      this.chatService.hubConnection.on('ReceiveMessage', (message: getMessage) => {
        this.messages.push(message);
        this.message = '';
      });
    }
  }

  sendMessage(chatId: number, content: string){
    this.chatService.sendMessage(chatId, content);
  }

  getMessages(chatId: number){
    this.selectedChatId = chatId;
    this.profileService.getChatMessages(chatId).subscribe(messages => {this.messages = messages});
  }
}
