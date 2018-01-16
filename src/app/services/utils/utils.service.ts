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

  sort(ob: any[], par: string, change?: boolean) {
    let nob: any = ob, type, parName: string = par;
    if (par.includes(":")) {
      parName = par.split(":")[0];
      type = par.split(":")[1];
    }
    if (!change) {
      nob = this.clone(ob)
    }
    nob.sort(function (a: any, b: any) {
      if (type == "string") return a[parName] > b[parName];
      else if (type == "boolean") return (!a[parName] && b[parName] && 1 || -1);
      else return parseFloat(a[parName]) - parseFloat(b[parName]);
    });
    // console.log('In sort() nob = ',nob);
    return nob;
  }


}
