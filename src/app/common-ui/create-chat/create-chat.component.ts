import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './create-chat.component.html',
  styleUrl: './create-chat.component.scss'
})
export class CreateChatComponent implements OnInit{
  @Output() createChat = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  
  chatForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.chatForm = this.fb.group({
      chatName: ['']
    });
  }

  onSubmit() {
    this.createChat.emit(this.chatForm.value.chatName);
    this.chatForm.reset();
  }

  closeModal() {
    this.close.emit();
  }
}
