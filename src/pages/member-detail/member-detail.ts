import {Component, NgZone, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, LoadingController, NavController,
  NavParams
} from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";
import {BaseClass} from "../BasePage";
import {MemberInviteProvider} from "../../providers/member/member-invite";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {StorageProvider} from "../../providers/storage/storage";
import {IMember} from "../../models/member.interface";
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
  canInviteMember: boolean = false;
  member :IMember;
  //private ooid: string;
  private orgName: string;
  //private ooid: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public actionSheeCtrl: ActionSheetController,
              private camera: Camera,
              public navParams: NavParams,
              private memberSvc: MemberProvider,
              private memberInviteSvc: MemberInviteProvider,
              private storageSvc: StorageProvider,
              private userData: UserData,
              public zone: NgZone) {
    super();
    this.memberKey = this.navParams.get('memberKey');
  }

  ngOnInit(): void {
    let self = this
    self.canInviteMember = self.userData.isEnableAddMember();
    self.loadMemberDetails2();
  }

  getUserImage() {
    return this.storageSvc.getStorageRef()
      .child(this.userData.currentOOId)
      .child('members/' + this.memberKey + '/profile.png').getDownloadURL();
  }

  private loadMemberDetails2(){
    this.userDataLoaded = false;
    this.memberSvc.getMemberData2(this.memberKey)
      .then(snapShot => {
        let userData: any = snapShot.val();
        if (userData == null)
          return null;
        this.member = {
          firstname: userData.firstname,
          lastname: userData.lastname,
          birthDate: userData.birthDate,
          uid: userData.uid,
          memberKey: userData.memberKey,
          email: userData.email,
          memberId: userData.memberId,
          photoUrl: (userData.photoUrl == null)?'assets/images/profile.png':userData.photoUrl,
          isMyCircle: false,
          textAvatar: userData.textAvatar
        };

        this.userDataLoaded = true;
        this.isUserProfileExists = this.member.uid != null;
        this.enableEditEmail = this.member.uid != null || (this.member.email == null);

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
          value: this.member.firstname
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.member.lastname
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.memberSvc.updateName(this.memberKey, data.firstname, data.lastname)
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
    //TODO: Get the Org Name, Role
    let role:number = 5
    let orgName:string = "Org"
    this.userData.getCurrentOOName().then(oname=>{
      orgName = oname;
    });
    this.memberInviteSvc
      .createUserInvite(this.userData.currentOOId, orgName, role, this.member);
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

    let uploadTask = this.storageSvc.getStorageRef()
      .child(this.userData.currentOOId)
      .child('members/' + this.memberKey + '/profile.png').put(file, metadata);

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
