import { AfterViewChecked, Component, ElementRef, inject, ViewChild} from '@angular/core';
import { SidebarComponent } from "../../common-ui/sidebar/sidebar.component";
import { ChatService } from '../../data/services/chat.service';
import { getMessage } from '../../data/interfaces/getMessage.interface';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { getChat } from '../../data/interfaces/getChat.interface';
import { PagedResponse } from '../../data/interfaces/PagedResponse.interface';
import { Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [SidebarComponent, NgForOf, FormsModule,NgIf,DatePipe],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})

export class ChatPageComponent implements AfterViewChecked{
  profileService = inject(ProfileService);
  router = inject(Router);

  public user: string = '';
  public message: string = '';
  public pagedMessages: PagedResponse<getMessage> | null = null; 
  public pagedChats: PagedResponse<getChat> | null = null;
  public selectedChatId: number | null = null;
  public currentPage: number = 1;
  public pageSize: number = 20;
  public isLoading: boolean = false;
  public hasMoreMessages: boolean = true;
  isSidebarCollapsed = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  public shouldScroll: boolean = false;

  constructor(private chatService: ChatService)
  { 
    this.profileService.getUserPrivateChats().subscribe(chats => {this.pagedChats = chats});
    
    if (this.chatService.hubConnection) {
      this.chatService.hubConnection.on('ReceiveMessage', (message: getMessage) => {
        this.pagedMessages?.data.push(message);
        this.shouldScroll = true;
      });
    }
  }

  onScroll() {
    if (this.isLoading || !this.hasMoreMessages) return;

    const element = this.scrollContainer.nativeElement;
    const scrollTop = element.scrollTop;
    
    if (scrollTop < 50) {
      this.loadNextPage();
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  
  private loadNextPage() {
    if (!this.selectedChatId || this.isLoading || !this.hasMoreMessages) return;

    this.isLoading = true;
    const prevPage = this.currentPage;
    this.currentPage++;

    this.profileService.getChatMessages(
      this.selectedChatId,
      this.currentPage,
      this.pageSize
    ).pipe(
      tap({
        next: newMessages => {
          const element = this.scrollContainer.nativeElement;
          const prevScrollHeight = element.scrollHeight;
          
          this.pagedMessages!.data.unshift(...newMessages.data);
          this.hasMoreMessages = this.hasNextPage();

          this.adjustScrollPosition(prevScrollHeight-2);
          
        },
        error: () => this.currentPage = prevPage
      }),
      finalize(() => this.isLoading = false)
    ).subscribe();
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
    this.currentPage = 1;
    this.hasMoreMessages = true;

    this.profileService.getChatMessages(chatId,this.currentPage,this.pageSize)
      .pipe(
        tap((messages => {
          this.pagedMessages = messages;
          this.shouldScroll = true;  
        }))
      )
      .subscribe();
  }
  
  getChatName(){
    if(this.selectedChatId != null){
      return this.pagedChats?.data.find((item) => item.id == this.selectedChatId)?.name
    }
    return "Chat name"
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

  private hasNextPage(){
    return this.currentPage < Math.ceil(this.pagedMessages!.totalItems / this.pageSize);
  }

  // Private chat name == username of second user 
  isMyMessage(message: getMessage) {
    return message.sender.username !== this.getChatName(); 
  }

  Logout(){
    this.profileService.logout().pipe(
      tap(() =>{
        this.router.navigate(['/login'])
        }
      )
    ).subscribe()
  }
}
