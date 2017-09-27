import { Component } from '@angular/core';
/**
 * Generated class for the AttmeUserAvatarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'attme-user-avatar',
  templateUrl: 'attme-user-avatar.html',
})
export class AttmeUserAvatarComponent {

  text: string;

  constructor() {
    //console.log('Hello AttmeUserAvatarComponent Component');
    this.text = 'Hello World';
  }

}
