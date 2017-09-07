// import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
// import { Camera, CameraOptions } from '@ionic-native/camera';
//
// const options: CameraOptions = {
//   quality: 100,
//   destinationType: this.camera.DestinationType.DATA_URL,
//   encodingType: this.camera.EncodingType.JPEG,
//   mediaType: this.camera.MediaType.PICTURE
// }
//
// @Injectable()
// export class CameraProvider {
//
//   constructor(private cameraPlugin: Camera) {
//     console.log('Hello CameraProvider Provider');
//   }
//
//   public takePicture():string{
//     let picture:string = null;
//     this.cameraPlugin.getPicture({
//       quality : 95,
//       destinationType : this.cameraPlugin.DestinationType.DATA_URL,
//       sourceType : this.cameraPlugin.PictureSourceType.CAMERA,
//       allowEdit : true,
//       encodingType: this.cameraPlugin.EncodingType.PNG,
//       targetWidth: 500,
//       targetHeight: 500,
//       saveToPhotoAlbum: true
//     }).then(imageData => {
//       picture = imageData;
//     }, error => {
//       console.log("ERROR -> " + JSON.stringify(error));
//     });
//     return picture;
//   }
// }
