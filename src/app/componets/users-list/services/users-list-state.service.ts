import {computed, DestroyRef, Injectable, signal} from "@angular/core";
import {UsersListApiService} from "./users-list-api.service";
import {IUser} from "../../../../interfaces/user.interface";
import {take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LocalStorageService} from "../../../services/local-storage.service";

@Injectable()
export class UsersListStateService {
    public readonly localStorageKey = 'users'
    public readonly users$ = computed<IUser[]>(() => this.state$().users)

    private readonly state$ = signal<{ users: IUser[] }>({
        users: []
    })
    constructor(private apiService: UsersListApiService, private localStorageService: LocalStorageService) {}

    public getUsersList(destroyRef: DestroyRef): void {
        const localStorageData = this.localStorageService.getDataFromStorage(this.localStorageKey);

        if (localStorageData) {
            this.successFetchUsersHandler(localStorageData);
        } else {
            this.apiService.getUsersList$()
                .pipe(take(1), takeUntilDestroyed(destroyRef))
                .subscribe({
                    next: (data) => this.successFetchUsersHandler(data.users)
                });
        }
    }

    public createNewUser(user: IUser): void {
        const users = this.users$();

        user.id = this.users$.length > 1 ? this.users$().length - 1 : this.users$().length;
        user.selected = false;
        users.push(user)

        this.state$.update((state) => ({
            ...state,
            users
        }));

        this.updateLocalStorageData(users, this.localStorageKey);
    }

    public removeSomeUsers(userIds: number[]): void {
        let users = this.users$()

        userIds.forEach((userId) => {
            users = users.filter((user) => user.id !== userId)
        })

        this.handleSuccessRemoveUsers(users);
    }

    public removeAllUsers(): void {
        this.handleSuccessRemoveUsers([]);
    }

    public updateUser(id: number, data: IUser): void {
        const users = this.users$()

        users.find((user) => {
            if (user.id === id) {
                user.name = data.name;
                user.phone = data.phone;
                user.email = data.email;
                user.surname = data.surname
            }
        })

        this.handleSuccessUpdateUser(users);
    }

    private successFetchUsersHandler(users: IUser[]): void {
        const mappedUsers = users.map((user, index) => ({
            ...user,
            id: index,
            selected: false
        }))

        this.state$.update((state) => ({
            ...state,
            users: mappedUsers
        }));

        this.updateLocalStorageData(users, this.localStorageKey);
    }

    private handleSuccessRemoveUsers(users: IUser[]): void {
        this.state$.update((state) => ({
            ...state,
            users,
        }));

        this.updateLocalStorageData(users, this.localStorageKey);
    }

    private handleSuccessUpdateUser(users: IUser[]): void {
        this.state$.update((state) => ({
            ...state,
            users,
        }));

        this.updateLocalStorageData(users, this.localStorageKey);
    }

    private updateLocalStorageData(data: any, key: string): void {
        this.localStorageService.setDataToStorage(key, data);
    }
}