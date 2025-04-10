import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { getChat } from '../../data/interfaces/getChat.interface';
import { SidebarChatComponent } from "../sidebar-chat/sidebar-chat.component";
import { NgFor, NgIf } from '@angular/common';
import { ChatPageComponent } from '../../pages/chat-page/chat-page.component';
import { CreateChatComponent } from "../create-chat/create-chat.component";
import { PagedResponse } from '../../data/interfaces/PagedResponse.interface';
import { finalize, tap } from 'rxjs';

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
  public currentPage: number = 1;
  public pageSize: number = 15;
  public isLoading: boolean = false;
  public hasMoreChats: boolean = true;
  isModalOpen = false;
  mediaAdaptiveWidth = 768;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    this.loadChats();
  }

  private loadChats() {
    this.profileService.getUserPrivateChats(1,this.pageSize)
      .pipe(
        tap((chats => {
          this.pagedChats = chats;  
        }))
      )
      .subscribe();
  }

  private loadNextPage() {
    if (this.isLoading || !this.hasMoreChats) return;

    this.isLoading = true;
    const prevPage = this.currentPage;
    this.currentPage++;

    this.profileService.getUserPrivateChats(
      this.currentPage,
      this.pageSize
    ).pipe(
      tap({
        next: newChats => {
          const element = this.scrollContainer.nativeElement;
          const prevScrollHeight = element.scrollHeight;
          
          this.pagedChats!.data.push(...newChats.data);
          this.hasMoreChats = this.hasNextPage();

          this.adjustScrollPosition(prevScrollHeight);
          
        },
        error: () => this.currentPage = prevPage
      }),
      finalize(() => this.isLoading = false)
    ).subscribe();
  } 
  
  private adjustScrollPosition(prevScrollHeight: number) {
    const element = this.scrollContainer.nativeElement;
    const scrollTopBeforeLoad = element.scrollTop;
    
    setTimeout(() => {
      const heightDifference = element.scrollHeight - prevScrollHeight;
      element.scrollTop = scrollTopBeforeLoad + heightDifference;
      
      const SAFETY_OFFSET = 10;
      element.scrollTop += SAFETY_OFFSET;
    }, 0);
  }

  onScroll() {
    if (this.isLoading || !this.hasMoreChats) return;

    const element = this.scrollContainer.nativeElement;
    const scrollTop = element.scrollTop;
    
    if (scrollTop > 250) {
      this.loadNextPage();
    }
  }

  private hasNextPage(): boolean {
    return this.currentPage < Math.ceil(this.pagedChats!.totalItems / this.pageSize);
  }

  onChatSelected(chatId: number) {
    if (window.innerWidth <= this.mediaAdaptiveWidth) {
        this.chatComponent.isSidebarCollapsed = true;
    }
    this.selectedChatId = chatId;
    this.chatComponent.getMessages(chatId);  
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  onCreateChat(joinUserId: string) {
    this.profileService.createUserPrivateChat(Number(joinUserId)).subscribe();
  }

  toggleSidebar(){
    this.chatComponent.toggleSidebar();
  }
}
