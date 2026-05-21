export enum StatusCodes {
  OK = 200,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  InternalError = 500,
}

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
}

export enum FosterLengths {
  Day = 'Day Trip',
  ShortTerm = 'Short Term',
  LongTerm = 'Long Term',
}
