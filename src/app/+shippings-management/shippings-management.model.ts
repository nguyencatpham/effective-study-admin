export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fax: string;
}

export interface ReminderInfo {
  id?: number;
  content: string;
  remindDateOnUtc: Date;
  userId: number;
  fullName?: string;
}

export interface SaleOrderInfo {
  orderId: number;
  customerPoId: string;
  orderDate: Date;
  dueDate: Date;
  orderType: string;
  status: string;
}

export interface PurchaseOrderInfo {
  poNumber: string;
  salesOrder: string;
  orderDate: Date;
  dueDate: Date;
  status: string;
}

export interface BasicProduct {
  id: number;
  company: string;
}

export interface ProductInfo extends BasicProduct {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fax: string;
  type: number;
  contacts: ContactInfo[];
  reminders: ReminderInfo[];
  salesOrders: SaleOrderInfo[];
}

export interface ProductListResp {
  data: ProductInfo[];
  totalRecord: number;
}

export interface PurchaseOrderListResp {
  data: PurchaseOrderInfo[];
  totalRecord: number;
}

export interface DistrictInfo {
  id: number,
  name: string,
  type: string,
  provinceId: string,
  displayOrder: number,
  isActive: boolean,
  feeShipping: number
}
