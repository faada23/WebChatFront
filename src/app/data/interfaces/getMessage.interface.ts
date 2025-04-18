import { getUser } from "./getUser.interface";

export interface getMessage {
    id: number;
    content: string;
    createdDate: string;
    sender: getUser;
}