import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-remove-users-modal-box',
  standalone: true,
    imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './remove-users-modal-box.component.html',
  styleUrls: ['./remove-users-modal-box.component.scss']
})
export class RemoveUsersModalBoxComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any | null) {}
}
