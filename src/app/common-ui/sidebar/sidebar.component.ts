import { Component, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { getChat } from '../../data/interfaces/getChat.interface';
import { SidebarChatComponent } from "../sidebar-chat/sidebar-chat.component";
import { NgFor, NgIf } from '@angular/common';
import { ChatPageComponent } from '../../pages/chat-page/chat-page.component';
import { CreateChatComponent } from "../create-chat/create-chat.component";
import { PagedResponse } from '../../data/interfaces/PagedResponse.interface';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarChatComponent, NgIf, NgFor, CreateChatComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService);
  chatComponent = inject(ChatPageComponent);

  public pagedChats : PagedResponse<getChat> | null = null;
  public selectedChatId: number | null = null;
  isModalOpen = false;

  constructor() {
    this.loadChats();
  }

  private loadChats() {
    this.profileService.getUserPrivateChats().subscribe({
      next: (chats) => this.pagedChats = chats,
      error: (err) => console.error('Error loading chats:', err)
    });
  }

  onChatSelected(chatId: number) {
    this.selectedChatId = chatId;
    this.chatComponent.getMessages(chatId);  
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  onCreateChat(chatName: string) {
    
  }
}
