import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  constructor() { }

}

//General Constants
export const blank = "";

//Role Constants
export const SA = "super";
export const ADMIN = "admin";
export const roles = [this.SA, this.ADMIN];
export const all = "all";

export const loginRoute = "login";
export const loginPath = ("/").concat(loginRoute);


export const invalidlogin = "Invalid login credentials";
export const expireToken = "Please provide a valid token.";
export const sessionExpire = "Session has expired, please re-login";

export const notfound = 404;
