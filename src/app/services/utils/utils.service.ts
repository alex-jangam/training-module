import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }
  clone(object : any) {
		return JSON.parse(JSON.stringify(object));
	}

  dateToUtc(dt: any){
    let nDate;
    try {
      nDate = new Date(dt).getTime()
    } catch(e){
      nDate = new Date().getTime()
    }
    return nDate;
  }


}
