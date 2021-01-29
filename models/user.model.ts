export interface IUser {
    id: number;
    email: string;
    password: string;
    companyId?: string;
    surname: string;
    name: string;
    companyAdmin?: boolean,
    isadmin?: boolean
  }