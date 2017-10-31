export interface BasicUserInfo {
  id: number;
  username: string;
  fullName: string;
}

export interface UserInfo extends BasicUserInfo {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imageId: number;
  imageUrl: string;
  listRoleIds: number[];
  password: string;
  confirmPassword: string;
  reminders: Reminder[];
  languageId: number;
  roles: Roles[];
}

export class UserInfo implements UserInfo {
  constructor() {
    this.id = undefined;
    this.userName = undefined;
    this.email = undefined;
    this.firstName = undefined;
    this.lastName = undefined;
    this.phoneNumber = undefined;
    this.imageId = undefined;
    this.imageUrl = undefined;
    this.password = undefined;
    this.confirmPassword = undefined;
    this.languageId = undefined;
  }
}

export interface UserToken {
  accessToken: string;
  refreshToken: string;
}

export class UserToken implements UserToken {
  constructor() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

}

export class Roles {
  id: number;
  name: string;
  status?: boolean;

  constructor() {
    this.id = undefined;
    this.name = undefined;
    this.status = undefined;
  }
}

export class FullAuthentication {
  acceptToken: string;
  token_type: string;
  refreshToken: string;
  expires_in: number;
  client_id: string;
  username: string;
  id: number;
  expires: string;
  error: string;
  error_description: string;

  constructor() {
    this.acceptToken = undefined;
    this.token_type = undefined;
    this.refreshToken = undefined;
    this.expires_in = undefined;
    this.client_id = undefined;
    this.username = undefined;
    this.id = undefined;
    this.expires = undefined;
    this.error = undefined;
    this.error_description = undefined;
  }
}

export interface UserListResponse {
  data: UserInfo[];
  totalRecord: number;
}

export interface DeleteUserModel {
  isCheckedAll: boolean;
  itemsRemoved: string;
  itemsChecked: string;
  keyword: string;
}

export interface Reminder {
  assignToUserId: number;
  avatarUrl: string;
  content: string;
  customerId: number;
  fullName: string;
  id: number;
  remindDateOnUtc: string;
  userId: number;
  createdOnUtc: string;
}
