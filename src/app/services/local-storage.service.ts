import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly prefix = 'initium';
    constructor() {}

    public setDataToStorage(key: string, data: any): void {
        localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(data));
    }

    public getDataFromStorage(key: string): any {
        const dataFormStorage = localStorage.getItem(`${this.prefix}_${key}`);

        if (dataFormStorage) {
            return JSON.parse(dataFormStorage);
        }

        return null;
    }
}