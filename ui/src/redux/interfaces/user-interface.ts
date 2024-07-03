import { Role } from "../../assets";

export interface UserInterface {
  isAdmin: boolean;
  name: string;
  username: string;
  _id: string;
  emailExist: boolean;
  role: Role;
  skills: string[]
}


