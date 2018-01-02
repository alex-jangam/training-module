import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class LoginChangeinService {
  private loggedIn = new Subject<boolean>();
  public lookfor = this.loggedIn.asObservable()
  constructor() { }

  public triggerLogin(){
    this.loggedIn.next(true)
  }
}
