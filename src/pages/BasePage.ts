import {Subject} from "rxjs/Subject";

export class BaseClass {
  protected componentDestroyed$: Subject<void> = new Subject<void>();
  constructor() {

    /// wrap the ngOnDestroy to be an Observable. and set free from calling super() on ngOnDestroy.
    let _$ = this.ngOnDestroy;
    this.ngOnDestroy = () => {
      this.componentDestroyed$.next();
      this.componentDestroyed$.complete();
      _$();
    }
  }

  /// placeholder of ngOnDestroy. no need to do super() call of extended class.
  ngOnDestroy() {
    console.log('BaseClass::everything works as intended with or without super call');
  }
}
