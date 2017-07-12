export class User {
	constructor(
		public username: string,
		public role: string,
		public password: string,
    public dname: string,
    public lastLogin: number,
  ) {  }
}
