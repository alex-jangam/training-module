import { Injectable } from '@angular/core';

@Injectable()
export class LocalstoreService {

  constructor() { }
  private set(item, data) {
    localStorage.setItem(item, data);
  }

  private get(item) {
    var storeOb, lStore = localStorage.getItem(item);
    try {
      storeOb = JSON.parse(lStore);
    } catch (e) {
      storeOb = lStore;
    }
    return storeOb;
  }

  private remove(item) {
    localStorage.removeItem(item);
  }

  private obtoString(ob : any){
    if(typeof ob === 'string')
      return ob
    return JSON.stringify(ob);
  }


  public saveItem(name, data) {
    this.set(name, this.obtoString(data));
  }

  public getItem(name) {
    return this.get(name);
  }

  public removeItem(name) {
    this.remove(name);
  }
}
