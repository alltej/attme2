import {Component,  OnInit} from '@angular/core';
import {IonicPage, NavController, AlertController, ActionSheetController, LoadingController} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import {MemberProvider} from "../../providers/member/member";
import {StorageProvider} from "../../providers/storage/storage";
import {IUser} from "../../models/user.interface";
import {IUserProfile} from "../../models/user-profile.interface";
import { Camera, CameraOptions } from '@ionic-native/camera';

import {UserData} from "../../providers/data/user-data";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit
{

  userProfile :IUserProfile;
  //birthDate:string;
  user: IUser;
  userDataLoaded: boolean = false;
  //avatar: string = "assets/images/profile-default.png";

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public actionSheeCtrl: ActionSheetController,
              private camera: Camera,
              public profileSvc: ProfileProvider,
              public authSvc: AuthProvider,
              public memberSvc: MemberProvider,
              public storageSvc: StorageProvider,
              private userData: UserData) {}

  ngOnInit(): void {

    //this.aoMemberKey = this.userData.getSelectOrgMemberKey();

    //console.log(`ooid==${this.ooid}::aoid::${this.aoMemberKey}`)
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.userDataLoaded = false;
    let currentUser: any = {};
    currentUser = this.authSvc.getLoggedInUser();
    this.profileSvc.getUserProfileData(currentUser.uid)
      .then(snapShot => {
        let userData: any = snapShot.val();
        let test:boolean = false;
        //console.log(`userData==${userData}`)

        this.userProfile = {
          firstname: userData.profile.firstname,
          lastname: userData.profile.lastname,
          birthDate: userData.profile.birthDate,
          image: 'assets/images/profile.png',
        };
        //this.birthDate = userData.birthDate;

        this.user = {
          uid : currentUser.uid,
          username : currentUser.email //userData.username
        };

        this.userDataLoaded = true;

      }).catch(e =>{
        //console.log(e)
    })

  }

  updateName(){
    const alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstname',
          placeholder: 'Your first name',
          value: this.userProfile.firstname
        },
        {
          name: 'lastname',
          placeholder: 'Your last name',
          value: this.userProfile.lastname
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            //console.log(data)
            this.profileSvc.updateName(this.authSvc.getLoggedInUser().uid, data.firstname, data.lastname);
            //TODO: Need to update member data on update of user profile
            //this.memberSvc.updateName(this.userProfile.memberKey, data.firstName, data.lastName);
            this.reload();
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(){

    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'birthDate',
          value: this.userProfile.birthDate,
          placeholder: 'Date of Birth(MM/YY/DDDD)',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            //let newEmail = data.newEmail;

            this.profileSvc.updateDOB(this.authSvc.getLoggedInUser().uid, data.birthDate).then( () =>{
              this.reload();
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  openImageOptions() {

    let actionSheet = this.actionSheeCtrl.create({
      title: 'Upload new image from',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Album',
          icon: 'folder-open',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });

    actionSheet.present();
  }

  openCamera(pictureSourceType: any) {

    let options: CameraOptions = {
      quality: 95,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imageData => {
      const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };

      let capturedImage: Blob = b64toBlob(imageData, 'image/png');
      this.startUploading(capturedImage);
    }, error => {
      //console.log('ERROR -> ' + JSON.stringify(error));
    });
  }

  startUploading(file) {

    let uid = this.authSvc.getLoggedInUser().uid;
    let progress: number = 0;
    // display loader
    let loader = this.loadingCtrl.create({
      content: 'Uploading image..',
    });
    loader.present();

    // Upload file and metadata to the object 'images/mountains.jpg'
    let metadata = {
      contentType: 'image/png',
      name: 'profile.png',
      cacheControl: 'no-cache',
    };

    let uploadTask = this.storageSvc.getStorageRef().child('users/' + uid + '/profile.png').put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, error => {
        loader.dismiss().then(() => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        });
      }, () => {
        loader.dismiss().then(() => {
          // Upload completed successfully, now we can get the download URL
          let downloadURL = uploadTask.snapshot.downloadURL;

          this.profileSvc.setUserImage(uid,downloadURL)
            .then( () => {
              //TODO: Update our membership photo?
              //this.memberSvc.updatePhotoUrl(this.ooid, this.aoMemberKey, downloadURL)
            }).catch( error => {
          })
            ;
          // this.profileSvc.updateimage(url).then((res: any) => {
          //   if (res.success) {
          //     statusalert.setTitle('Updated');
          //     statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          //     statusalert.present();
          //     this.zone.run(() => {
          //       this.avatar = url;
          //     })
          //   }
          // }).then( () =>{
          //   //console.log(`ProfilePage::${this.userProfile.memberKey}`)
          //   this.memberSvc.updatePhotoUrl(this.userProfile.memberKey, this.avatar)
          // })
          //   .catch((err) => {
          //     statusalert.setTitle('Failed');
          //     statusalert.setSubTitle('Your profile pic was not changed');
          //     statusalert.present();
          //   })
          this.reload();
        });
      });
  }

  updatePassword(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileSvc.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }

  reload() {
    this.loadUserProfile();
  }

  // editimage() {
  //   let statusalert = this.alertCtrl.create({
  //     buttons: ['okay']
  //   });
  //   this.profileImageSvc.uploadimage().then((url: any) => {
  //     this.profileSvc.updateimage(url).then((res: any) => {
  //       if (res.success) {
  //         statusalert.setTitle('Updated');
  //         statusalert.setSubTitle('Your profile pic has been changed successfully!!');
  //         statusalert.present();
  //         this.zone.run(() => {
  //           this.avatar = url;
  //         })
  //       }
  //     }).then( () =>{
  //       //console.log(`ProfilePage::${this.userProfile.memberKey}`)
  //       this.memberSvc.updatePhotoUrl(this.ooid, this.aoMemberKey, this.avatar)
  //     })
  //       .catch((err) => {
  //         statusalert.setTitle('Failed');
  //         statusalert.setSubTitle('Your profile pic was not changed');
  //         statusalert.present();
  //       })
  //   })
  // }


}
