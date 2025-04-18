import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getChat } from '../../data/interfaces/getChat.interface';
import {SlicePipe, UpperCasePipe } from '@angular/common';
import { ChatType } from '../../data/enums/chatType.enum';

@Component({
  selector: 'app-sidebar-chat',
  imports: [SlicePipe,UpperCasePipe],
  templateUrl: './sidebar-chat.component.html',
  styleUrl: './sidebar-chat.component.scss'
})
export class SidebarChatComponent {
  @Input() chat!: getChat;
  @Output() selected = new EventEmitter<number>();

  getDisplayedChatType(): string {
    return this.chat.chatType === ChatType.Private ? 'Private Chat' : 'Group Room';
  }
}

