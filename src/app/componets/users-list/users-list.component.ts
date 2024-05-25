import {Component, DestroyRef, effect, Injector, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UsersListStateService} from "./services/users-list-state.service";
import {IUsersCheckbox} from "../../../interfaces/users-checkbox.interface";
import {IUser} from "../../../interfaces/user.interface";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AddEditUserModalBoxComponent} from "./components/add-edit-user-modal-box/add-edit-user-modal-box.component";
import {RemoveUsersModalBoxComponent} from "./components/remove-users-modal-box/remove-users-modal-box.component";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    NgForOf,
    FormsModule,
    MatDialogModule,
  ],
  providers: [UsersListStateService]
})
export class UsersListComponent implements OnInit {
  public usersCheckbox: IUsersCheckbox = {
    name: 'Имя',
    surname: 'Фамилия',
    email: 'E-mail',
    phone: 'Телефон',
    selected: false,
    users: [],
  };

  public allSelected = false;
  public selectedList: number[] = [];

  constructor(
      public stateService: UsersListStateService,
      private injector: Injector,
      private destroyRef: DestroyRef,
      private dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.stateService.getUsersList(this.destroyRef);
    this.subscribeOnUsersUpdate();
  }

  public setAll(isSelect: boolean): void {
    this.allSelected = isSelect;
    if (!this.usersCheckbox.users.length) {
      return;
    }
    this.usersCheckbox.users.forEach(user => (user.selected = isSelect));
  }

  public someComplete(): boolean {
    if (!this.usersCheckbox.users.length) {
      return false;
    }
    return this.usersCheckbox.users.filter(user => user.selected).length > 0 && !this.allSelected;
  }

  public selectUnselectUser(id: number | undefined, isSelect: boolean): void {
    if (isSelect) {
      this.selectedList.push(id as number)
    } else {
      this.selectedList = this.selectedList.filter((userId) => userId !== id);
    }

    this.usersCheckbox.users[id as number].selected = isSelect
  }

  public createNewUser(): void {
    const dialogRef = this.dialog.open(AddEditUserModalBoxComponent)

    dialogRef.beforeClosed().subscribe((result) => {
      if (result) {
        this.stateService.createNewUser(result)
      }
    })
  }

  public removeUsers(): void {
    const count = this.allSelected ? this.usersCheckbox.users.length : this.selectedList.length;

    const dialogRef = this.dialog.open(RemoveUsersModalBoxComponent, {
      data: {
        count,
      }
    })

    dialogRef.beforeClosed().subscribe((result) => {
      if (result) {
        this.allSelected ? this.stateService.removeAllUsers() : this.stateService.removeSomeUsers(this.selectedList)
        this.selectedList = [];
        this.allSelected = false;
      }
    });
  }

  public updateUser(user: IUser): void {
    const dialogRef = this.dialog.open(AddEditUserModalBoxComponent, {
      data: {
        user
      }
    })

    dialogRef.beforeClosed().subscribe((result) => {
      if (result) {
        this.stateService
            .updateUser(result.id as number, {name: result.name, email: result.email, surname: result.surname, phone: result.phone})
      }
    })
  }

  private subscribeOnUsersUpdate(): void {
    effect(() => {
      this.usersCheckbox.users = this.stateService.users$()
    }, {injector: this.injector, allowSignalWrites: true});
  }
}
