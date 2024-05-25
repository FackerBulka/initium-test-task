import {Injectable, signal} from "@angular/core";
import {UsersListApiService} from "./users-list-api.service";
import {IUser} from "../../../../interfaces/user.interface";

@Injectable()
export class UsersListStateService {
    private readonly state$ = signal({})
    constructor(private apiService: UsersListApiService) {}

    public getUsersList(): void {
        this.apiService.getUsersList$().subscribe({
            next: (data) => console.log(data)
        })
    }
}