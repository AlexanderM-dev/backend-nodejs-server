// TODO. Этот файл называется моделью, тут нет класса. !!!! ГОТОВО, сделал папку models.

export interface ISubscription {
    id: number;
    activateDate: Date;
    startDate: Date;
    endDate: Date;
    companyId: string;
    productId: string
  }