import { AfterViewChecked, Component, ElementRef, inject, ViewChild} from '@angular/core';
import { SidebarComponent } from "../../common-ui/sidebar/sidebar.component";
import { ChatService } from '../../data/services/chat.service';
import { getMessage } from '../../data/interfaces/getMessage.interface';
import { NgForOf } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { tap } from 'rxjs';
import { getChat } from '../../data/interfaces/getChat.interface';

@Component({
  selector: 'app-chat',
  imports: [SidebarComponent, NgForOf, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})

export class ChatPageComponent implements AfterViewChecked{
  profileService = inject(ProfileService);
  
  public user: string = '';
  public message: string = '';
  public messages: getMessage[] = []; 
  public chats: getChat[] = [];
  public selectedChatId: number | null = null;
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  public shouldScroll: boolean = false;

  constructor(private chatService: ChatService)
  { 
    this.profileService.getUserPrivateChats().subscribe(chats => {this.chats = chats});
    
    if (this.chatService.hubConnection) {
      this.chatService.hubConnection.on('ReceiveMessage', (message: getMessage) => {
        this.messages.push(message);
        this.shouldScroll = true;
      });
    }
  }

  ngAfterViewChecked(): void {
    if(this.shouldScroll){
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
      this.shouldScroll = false;
    } 
  }

  sendMessage(chatId: number, content: string){
    this.chatService.sendMessage(chatId, content);
    this.message = '';
  }

  getMessages(chatId: number){
    this.selectedChatId = chatId;

    this.profileService.getChatMessages(chatId)
      .pipe(
        tap((messages => {
          this.messages = messages;
          this.shouldScroll = true;  
        }))
      )
      .subscribe();
  }
  
  getChatName(){
    if(this.selectedChatId != null){
      return this.chats.find((item) => item.id == this.selectedChatId)?.name
    }
    return "Chat name"
  }
}
