import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {IUser} from "../../../../interfaces/user.interface";

@Injectable({
    providedIn: 'root'
})
export class UsersListApiService {
    constructor(private http: HttpClient) {}

    public getUsersList$(): Observable<any> {
        return this.http.get('https://test-data.directorix.cloud/task1').pipe(map((res) => res))
    }
}