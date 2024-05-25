import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {IUser} from "../../../../../interfaces/user.interface";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-add-edit-user-modal-box',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './add-edit-user-modal-box.component.html',
  styleUrls: ['./add-edit-user-modal-box.component.scss']
})
export class AddEditUserModalBoxComponent implements OnInit {
  public userForm!: FormGroup;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any | null,
  ){}

  public ngOnInit(): void {
    this.setUpForm()
  }

  public initValueOnClose(): IUser {
    if (this.data) {
      return {
        ...this.userForm.value,
        id: this.data.user.id
      }
    } else {
      return this.userForm.value
    }
  }

  private setUpForm(): void {
    const phonePattern = /(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.min(2)]),
      surname: new FormControl('', [Validators.required, Validators.min(2)]),
      phone: new FormControl('', [Validators.pattern(phonePattern)]),
      email: new FormControl('', [Validators.pattern(emailPattern)]),
    })

    if (this.data) {
      this.initFormData(this.data.user)
    }
  }

  private initFormData(user: IUser): void {
    this.userForm.patchValue({
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      email: user.email
    })
  }
}
