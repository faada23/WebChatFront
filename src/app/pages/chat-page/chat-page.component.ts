import { Component, inject, NgModule} from '@angular/core';
import { SidebarComponent } from "../../common-ui/sidebar/sidebar.component";
import { ChatService } from '../../data/services/chat.service';
import { Message } from '../../data/interfaces/message.interface';
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
  public messages: Message[] = []; 
  public chats : any[] = [];

  constructor(private chatService: ChatService)
  { 
    this.profileService.getUserChats().subscribe(chats => {this.chats = chats});
    this.chatService.hubConnection?.on('ReceiveMessage', (user: string, content: string) => {
      this.messages.push({ user, content });
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.user, this.message);
    this.message = '';
  }
  
}
