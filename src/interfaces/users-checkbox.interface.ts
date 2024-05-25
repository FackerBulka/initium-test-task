import {IUser} from "./user.interface";

export interface IUsersCheckbox {
    name: string;
    surname: string;
    email: string;
    phone: string;
    selected: boolean;
    users: IUser[];
}