import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class OverlayService {
  private overLaySrc = new Subject<boolean>();
  public overlayObs$ = this.overLaySrc.asObservable();
  constructor() {

   }
   totalList:any[] = []
   openLayer(val, ob?){
     let nob = {};
     if(val){
        if(this.totalList.length === 0) {
          this.overLaySrc.next(val);//true: open layer
        }
        this.totalList.push(nob);
     } else {
        let sliceInd = this.totalList.indexOf(ob);
        this.totalList.splice(sliceInd, 1);
        if(this.totalList.length === 0){
          this.overLaySrc.next(val);//false: close layer
        }
     }
   }
}
