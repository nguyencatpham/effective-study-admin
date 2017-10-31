export interface BasicResponse {
  status: boolean;
  message?: string;
  errorMessages?: string;
}

export interface ResponseMessage<T> extends BasicResponse {
  data?: T;
}
