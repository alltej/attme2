import {Subject} from "rxjs/Subject";

export class BaseClass {
  protected componentDestroyed$: Subject<boolean> = new Subject<boolean>();
  //private subscriptions: Array<Subscription> = [];

  constructor() {
    this.componentDestroyed$ = new Subject<boolean>();
    let f = this.ngOnDestroy;
    this.ngOnDestroy = function()  {
      // without this I was getting an error if the subclass had
      // this.blah() in ngOnDestroy
      f.bind(this)();
      //console.log('next')
      this.componentDestroyed$.next(true);
      //console.log('complete')
      this.componentDestroyed$.complete();
    };
  }

  /// placeholder of ngOnDestroy. no need to do super() call of extended class.
  ngOnDestroy() {
    console.log('DEBUG::BaseClass::everything works as intended with or without super call');
  }
}
