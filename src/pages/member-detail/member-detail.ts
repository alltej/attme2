import {Component, NgZone, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, LoadingController, NavController,
  NavParams
} from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";
import {BaseClass} from "../BasePage";
import {ProfileImageProvider} from "../../providers/profile/profile-image";
import {MemberInviteProvider} from "../../providers/member/member-invite";
import { Camera, CameraOptions } from 'ionic-native';
import {StorageProvider} from "../../providers/storage/storage";
import {IMember} from "../../models/member.interface";
import {ProfileProvider} from "../../providers/profile/profile";
import {UserData} from "../../providers/data/user-data";

@IonicPage({
  segment: ':memberKey'
})
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html',
})
export class MemberDetailPage extends BaseClass implements OnInit{
  private memberKey: any;

  //public member: any = {};
  public isUserProfileExists: boolean = false;
  private enableEditEmail: boolean = false;
  avatar: string = "assets/images/profile-default.png";
  userDataLoaded: boolean = false;
  member :IMember;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public actionSheeCtrl: ActionSheetController,
              public navParams: NavParams,
              private memberSvc: MemberProvider,
              private profileImageSvc: ProfileImageProvider,
              private profileSvc: ProfileProvider,
              private memberInviteSvc: MemberInviteProvider,
              private storageSvc: StorageProvider,
              private userData: UserData,
              public zone: NgZone) {
    super();
    this.memberKey = this.navParams.get('memberKey');
  }

  ngOnInit(): void {
    console.log(this.memberKey)
    this.loadMemberDetails2();
  }

  getUserImage() {
    return this.storageSvc.getStorageRef().child('members/' + this.memberKey + '/profile.png').getDownloadURL();
  }

  private loadMemberDetails2(){
    this.userDataLoaded = false;
    this.memberSvc.getMemberData2(this.userData.getSelectedOrganization(),this.memberKey).then(snapShot => {
      let userData: any = snapShot.val();
      // console.log(userData.$key)
      // console.log(userData)
      this.getUserImage().then(url => {
        this.member = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          birthDate: userData.birthDate,
          uid: userData.uid,
          memberKey: userData.memberKey,
          email: userData.email,
          memberId: userData.memberId,
          photoUrl: url,
          isMyCircle: false
        };

        this.userDataLoaded = true;

      }).catch(error => {
        //console.log(error.code);
        //TODO
        this.member = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          birthDate: userData.birthDate,
          uid: userData.memberKey,
          memberKey: userData.memberKey,
          email: userData.email,
          memberId: userData.memberId,
          photoUrl: 'assets/images/profile.png',
          isMyCircle: false
        };

        this.userDataLoaded = true;
      });

      //console.log("aaaa11")
      this.profileSvc.findMemberId2(this.memberKey).on('value', (snapshot) =>
        {
          let data = snapshot.val();
          //console.log(data)
          if (data){
            //console.log("bbb22")
            this.isUserProfileExists = true;
          }
          //console.log(`this.member::${this.member}`)
          if (this.member != null) {
            this.enableEditEmail = !this.isUserProfileExists || (this.member.email == null);
          }
          //this.enableEditEmail = !this.isUserProfileExists || (this.member.email == null);
        })

    })



  }

  // private loadMemberDetails() {
  //   this.userDataLoaded = false;
  //   this.memberSvc.getMember(this.memberKey)
  //     .takeUntil(this.componentDestroyed$)
  //     .subscribe((data) => {
  //       if (data != null) {
  //         this.member = data;
  //         //TODO
  //         //this.avatar = 'assets/img/profile.png';
  //         //this.member.imageUrl = 'assets/img/profile.png';
  //         // this.zone.run(() => {
  //         //   this.avatar = this.member.photoUrl;
  //         // })
  //         if (this.member.photoUrl == null) {
  //           this.avatar = "assets/images/profile-default.png";
  //         } else {
  //           this.avatar = this.member.photoUrl
  //         }
  //
  //         this.userDataLoaded = true;
  //       }
  //     });
  //
  //   this.memberSvc.findMemberId(this.memberKey)
  //   //.takeUntil(this.componentDestroyed$)
  //     .subscribe((data) => {
  //       if (data.length > 0) {
  //         this.isUserProfileExists = true;
  //       }
  //       this.enableEditEmail = !this.isUserProfileExists || (this.member.email == null);
  //     });
  // }

  updateName(){
    const alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.member.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.member.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.memberSvc.updateName(this.memberKey, data.firstName, data.lastName)
              .then( () =>{
              this.reload()
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  updateEmail(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          value: this.member.email,
          placeholder: 'Your new email',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {

            this.memberSvc.updateEmail(this.memberKey, data.newEmail)
              .then( () =>{
                this.reload()
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
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
          value: this.member.birthDate,
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

            this.memberSvc.updateDOB(this.memberKey, data.birthDate)
              .then( () =>{
                this.reload()
              }).catch(error => {
                //console.log('ERROR: '+error.message);
              });
          }
        }
      ]
    });
    alert.present();
  }

  updateMemberId(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newMemberId',
          value: this.member.memberId,
          placeholder: 'Your member ID if any',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.memberSvc.updateMemberId(this.memberKey, data.newMemberId)
              .then( () =>{
                this.reload()
              }).catch(error => {
                //console.log('ERROR: '+error.message);
              });
          }
        }
      ]
    });
    alert.present();
  }

  onCreateInvite() {
    this.memberInviteSvc.createUserInvite(this.memberKey, this.member.lastName, this.member.firstName, this.member.email);

  }

  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['OK']
    });
    this.profileImageSvc.uploadMemberImage(this.memberKey)
      .then((url: any) => {
      this.memberSvc.updatePhotoUrl(this.memberKey, url)
        .then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Updated');
          statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          statusalert.present();
          this.zone.run(() => {
            this.avatar = url;
          })
        }
      }).catch((err) => {
          statusalert.setTitle('Failed');
          statusalert.setSubTitle('Your profile pic was not changed');
          statusalert.present();
        })
    })
  }


  openImageOptions() {

    let actionSheet = this.actionSheeCtrl.create({
      title: 'Upload new image from',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.openCamera(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Album',
          icon: 'folder-open',
          handler: () => {
            this.openCamera(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });

    actionSheet.present();
  }

  openCamera(pictureSourceType: any) {

    let options: CameraOptions = {
      quality: 95,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    Camera.getPicture(options).then(imageData => {
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

    //let uid = this.authSvc.getLoggedInUser().uid;
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

    let uploadTask = this.storageSvc.getStorageRef().child('members/' + this.memberKey + '/profile.png').put(file, metadata);

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
          this.memberSvc.updatePhotoUrl(this.memberKey, downloadURL)
          this.reload();
        });
      });
  }

  reload() {
    this.loadMemberDetails2();
  }
}
