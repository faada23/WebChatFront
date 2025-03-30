import { Component, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { getChat } from '../../data/interfaces/getChat.interface';
import { SidebarChatComponent } from "../sidebar-chat/sidebar-chat.component";
import { NgFor, NgIf } from '@angular/common';
import { ChatPageComponent } from '../../pages/chat-page/chat-page.component';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarChatComponent,NgIf,NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService);
  chatComponent = inject(ChatPageComponent);

  public chats : getChat[] = [];
  public selectedChatId: number | null = null;

  constructor() {
    this.loadChats();
  }

  private loadChats() {
    this.profileService.getUserPrivateChats().subscribe({
      next: (chats) => this.chats = chats,
      error: (err) => console.error('Error loading chats:', err)
    });
  }

  onChatSelected(chatId: number) {
    this.selectedChatId = chatId;
    this.chatComponent.getMessages(chatId);  
  }
}
