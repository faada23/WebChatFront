import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { PagedResponse } from '../../data/interfaces/PagedResponse.interface';
import { getUser } from '../../data/interfaces/getUser.interface';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-chat',
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './create-chat.component.html',
  styleUrl: './create-chat.component.scss'
})
export class CreateChatComponent implements OnInit {
  @Output() createChat = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  
  chatForm!: FormGroup;
  usersList: getUser[] = [];
  showUsersList = false;
  selectedUser: getUser | null = null;

  showMessage = false;
  Message = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.chatForm = this.fb.group({
      chatName: ['']
    });

    this.setupSearch();
    this.setupFormChanges();
  }

  private setupSearch() {
    this.chatForm.get('chatName')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(filter => 
          this.profileService.getUsers(filter, 1, 5)
        )
      )
      .subscribe(users => {
        this.usersList = users.data;
        this.showUsersList = users.data.length > 0;
      });
  }

  private setupFormChanges() {
    this.chatForm.get('chatName')?.valueChanges.subscribe(value => {
      if (this.selectedUser && value !== this.selectedUser.username) {
        this.selectedUser = null;
      }
    });
  }

  selectUser(user: getUser) {
    this.selectedUser = user;
    this.chatForm.patchValue({ chatName: user.username });
    this.showUsersList = false;
  }

  onSubmit() {
    if (this.selectedUser) {
      this.createChat.emit(this.selectedUser.id.toString());
      this.chatForm.reset();
      this.usersList = [];
      this.selectedUser = null;
    }
  }

  closeModal() {
    this.close.emit();
    this.usersList = [];
  }

}
