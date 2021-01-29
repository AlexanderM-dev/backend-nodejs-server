// TODO. Этот файл называется моделью, тут нет класса. !!!! ГОТОВО, сделал папку models.

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