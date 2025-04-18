import { ChatType } from "../enums/chatType.enum";
import { getUser } from "./getUser.interface";

export interface getChat{
    id: number;
    name: string;
    chatType: ChatType;
    users: getUser[];
}