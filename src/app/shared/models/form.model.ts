export class LoginForm {
  email: string;
  password: string;

  constructor() {
    this.email = undefined;
    this.email = undefined;
  }
}

export class ForgotPasswordForm {
  email: string;

  constructor() {
    this.email = undefined;
  }
}

export class ResetUserInfo {
  userId: number;
  password: string;
  confirmPassword: string;
  code: string;

  constructor() {
    this.userId = undefined;
    this.password = undefined;
    this.confirmPassword = undefined;
    this.code = undefined;
  }
}
