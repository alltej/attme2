import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, NavController, ToastController} from 'ionic-angular';
import {FormControl} from "@angular/forms";
import {EventProvider} from "../../providers/event/event";
import {UserLikesProvider} from "../../providers/user-likes/user-likes";
import {BaseClass} from "../BasePage";
import {Observable} from "rxjs/Observable";
import {IEvent, ILikedBy} from "../../models/event.interface";
import {DataProvider} from "../../providers/data/data";
import {SqliteService} from "../../providers/sqlite-service/sqlite-service";
import {AuthProvider} from "../../providers/auth/auth";
import {MappingProvider} from "../../providers/mapper/mapping";
import {ItemsProvider} from "../../providers/mapper/items-provider";
import {attmeConfig} from "../../config/attme.config";
import {UserData} from "../../providers/data/user-data";

@IonicPage()
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage extends BaseClass implements OnInit, OnDestroy{
  @ViewChild(Content) content: Content;
  public internetConnected: boolean = true;
  public firebaseConnectionAttempts: number = 0;
  public weekNumber: number;
  public pageSize: number = 4;

  public iEvents: Array<IEvent> = [];
  public newIEvents: Array<IEvent> = [];
  searchControl: FormControl;
  queryText: string = '';
  loading: any = false;
  segment: string;
  selectedSegment: string = this.segment;

  private whenStartFilter: string;
  private whenEndFilter: string;
  private ooid: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public eventSvc: EventProvider,
              private userLikeSvc: UserLikesProvider,
              //public sqliteSvc: SqliteService,
              public mappingsService: MappingProvider,
              public itemsSvc: ItemsProvider,
              private  authSvc: AuthProvider,
              public dataSvc: DataProvider,
              private userData: UserData,
              public events: Events) {
    super();
    //console.log(`this.userData.getCurrentOOID()==${this.userData.getCurrentOOID()}`)
    this.ooid = this.userData.getCurrentOOID();

    this.searchControl = new FormControl();

    let currentDate = Date.now() + -attmeConfig.eventRecentPriorNumDays*24*3600*1000; // date n days ago in milliseconds UTC;
    let futureDateMax = Date.now() + +60*24*3600*1000; // date n days ago in milliseconds UTC
    this.whenStartFilter = new Date(currentDate).toISOString();
    this.whenEndFilter = new Date(futureDateMax).toISOString();

    this.events.subscribe('reloadPage1', (fromStart) => {
      this.loadEvents(fromStart);
    });
  }

  onAddLike(ooid : string, eventKey: string){
    this.userLikeSvc.addLike(ooid, eventKey);
    //this.reloadEvents();
  }

  onRemoveLike(ooid : string, eventKey: string){
    this.userLikeSvc.removeLike(ooid, eventKey);
    //this.reloadEvents();
  }

  ngOnInit(): void {
    //console.log(`event-lists::`);
    let self = this;
    self.segment = "current";
    self.weekNumber = 0;

    self.events.subscribe('network:connected', self.networkConnected);
    self.events.subscribe('events:add', self.addNewThreads);
    self.events.subscribe('events:liked', self.loadEvents);

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.loading = false;
      self.checkFirebase();
    });

    // this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
    //   this.loading = false;
    //   this.setFilteredItems();
    // });
  }

  checkFirebase() {
    let self = this;
    if (!self.dataSvc.isFirebaseConnected()) {
      setTimeout(() =>{
        //console.log('Retry : ' + self.firebaseConnectionAttempts);
        self.firebaseConnectionAttempts++;
        if (self.firebaseConnectionAttempts < 5) {
          self.checkFirebase();
        } else {
          self.internetConnected = false;
          self.dataSvc.goOffline();
          //self.loadSqliteEvents();
        }
      }, 1000);
    } else {
      //console.log('Firebase connection found (threads.ts) - attempt: ' + self.firebaseConnectionAttempts);
      //    let newItemRef = this.dataSvc.getOrgsRef().child(`${this.userData.getSelectedOrganization()}/events`).push();

      self.dataSvc.getOrgsRef().child(`${this.ooid}/stats/events`).on('child_changed', self.onEventAdded);
      if (self.authSvc.getLoggedInUser() === null) {
        //console.log('getLoggedInUser is null')
      } else {
        self.loadEvents(true);
      }
    }
  }

  // loadSqliteEvents() {
  //   let self = this;
  //
  //   if (self.iEvents.length > 0)
  //     return;
  //
  //   self.iEvents = [];
  //   //console.log('Loading from db..');
  //   self.sqliteSvc.getEvents().then((data) => {
  //     //console.log('Found in db: ' + data.rows.length + ' threads');
  //     if (data.rows.length > 0) {
  //       for (var i = 0; i < data.rows.length; i++) {
  //         let anEvent: IEvent = {
  //           key: data.rows.item(i).key,
  //           name: data.rows.item(i).name,
  //           description: data.rows.item(i).description,
  //           when: data.rows.item(i).when,
  //           where: data.rows.item(i).where,
  //           attendeesCount: data.rows.item(i).attendeesCount,
  //           likes: data.rows.item(i).likes,
  //           comments: data.rows.item(i).comments,
  //           isLiked: false, //TODO
  //           //tags: []
  //         };
  //
  //         self.iEvents.push(anEvent);
  //         //console.log('Event added from db:' + anEvent.key);
  //         //console.log(anEvent);
  //       }
  //       self.loading = false;
  //     }
  //   }, (error) => {
  //     //console.log('Error: ' + JSON.stringify(error));
  //     self.loading = true;
  //   });
  // }

  public networkConnected = (connection) => {
    let self = this;
    self.internetConnected = connection[0];
    //console.log('NetworkConnected event: ' + self.internetConnected);

    if (self.internetConnected) {
      self.iEvents = [];
      self.loadEvents(true);
    } else {
      self.notify('Connection lost. Working offline..');
      // save current threads..
      setTimeout(function () {
        //console.log(self.iEvents.length);
        // self.sqliteSvc.saveEvents(self.iEvents);
        // self.loadSqliteEvents();
      }, 1000);
    }
  }

  public onEventAdded = (childSnapshot, prevChildKey) => {
    let priority = childSnapshot.val(); // priority..
    //console.log(`priority=${priority}`)
    let self = this;
    self.events.publish('event:created');
    // fetch new thread..
    self.dataSvc.getEventsRef(this.ooid)
      .orderByPriority().equalTo(priority).once('value').then(dataSnapshot => {
      let key = Object.keys(dataSnapshot.val())[0];
      let newThread: IEvent = self.mappingsService.getEvent(dataSnapshot.val()[key], key);
      self.newIEvents.push(newThread);
    });
  }

  public addNewThreads = () => {
    let self = this;
    self.newIEvents.forEach(function (anEvent: IEvent) {
      self.iEvents.unshift(anEvent);
    });

    self.newIEvents = [];
    self.scrollToTop();
    self.events.publish('events:viewed');
  }

  scrollToTop() {
    let self = this;
    setTimeout(function () {
      self.content.scrollToTop();
    }, 1500);
  }

  reloadThreads(refresher) {
    this.queryText = '';
    if (this.internetConnected) {
      this.loadEvents(true);
      refresher.complete();
    } else {
      refresher.complete();
    }
  }

  fetchNextThreads(infiniteScroll) {
    if (this.weekNumber > 0 && this.internetConnected) {
      this.loadEvents(false);
      infiniteScroll.complete();
    } else {
      infiniteScroll.complete();
    }
  }

  loadEvents(fromStart: boolean) {
    //console.log(`event-list::loadEvents::fromStart:${fromStart}::segment:${this.segment}`)

    //try to reset this.ooid if get set to null/undefined
    if (this.ooid == null) {
      this.ooid = this.userData.getCurrentOOID();
    }

    let self = this;

    if (fromStart) {
      //console.log(`fromStart::true`)
      self.loading = true;
      self.iEvents = [];
      self.newIEvents = [];
      self.weekNumber = 0;

      if (self.segment === 'current') {
        self.getThreads();
      } else {
        self.getThreads();
        // this.dataSvc.getTotalThreads().then(snapshot => {
        //   self.getThreads();
        // }).catch( error=> {
        //   console.log(error)
        // });
      }
    } else {
      //console.log(`fromStart::false`)
      self.getThreads();
    }
  }


  getThreads() {
    let self = this;

    if (self.segment === 'current') {

      let currentDate = Date.now() + -attmeConfig.eventRecentPriorNumDays*24*3600*1000; // date n days ago in milliseconds UTC;
      let futureDateMax = Date.now() + attmeConfig.eventRecentFutureNumDaysMax*24*3600*1000; // date n days ago in milliseconds UTC
      this.whenStartFilter = new Date(currentDate).toISOString();
      this.whenEndFilter = new Date(futureDateMax).toISOString();

      this.dataSvc.getOrgsRef()
        .child(this.ooid)
        .child('events')
        .orderByChild('when')
        .startAt(this.whenStartFilter)
        .endAt(this.whenEndFilter)
        .once('value', snapshot => {
          self.mappingsService
            .getEvents(snapshot).forEach(anEvent => {
              //anEvent.likedBy.
            if (anEvent.likedBy != null) {
              let userLikes: Array<string> = Object.keys(anEvent.likedBy);
              //console.log(userLikes)
              //TODO: refactor to not use the indexOf
              if (userLikes.length>0 && userLikes.indexOf(self.authSvc.getLoggedInUser().uid) > -1) {
                anEvent.isLiked = true
              }
            }
              // if (anEvent.likedBy.keys()) {
              //
              // }
            if (self.queryText.trim().length !== 0) {
              if (anEvent.name.toLowerCase().includes(self.queryText.toLowerCase()) || anEvent.description.toLowerCase().includes(self.queryText.toLowerCase()))
                self.iEvents.push(anEvent);
            }else{
              self.iEvents.push(anEvent);
            }
          });
          this.iEvents.sort(function(a, b) {
            return new Date(a.when).getTime() - new Date(b.when).getTime()
          });

          self.events.publish('events:viewed');
          self.loading = false;
        });
    } else {

      let daysTo:number;// = this.week*7

      //TODO: simplify
      if (this.weekNumber == 0) {
        let startFrom: number = self.pageSize + self.weekNumber;
        let daysFrom:number = startFrom*7
        daysTo = this.weekNumber*7
        let startDate = Date.now() - daysFrom*24*3600*1000; // date n days ago in milliseconds UTC
        let endDateDate = Date.now() - (daysTo)*24*3600*1000; // date n days ago in milliseconds UTC
        this.whenStartFilter = new Date(startDate).toISOString().substring(0, 10);
        this.whenEndFilter = new Date(endDateDate).toISOString().substring(0, 10);
      }

      if (this.weekNumber > 52) {
        //console.log('You have reach the max number of weeks')
        //console.log(`NEW self.start::${self.weekNumber}`)
        //this.scrollToTop();
        return;
      }
      this.dataSvc.getEventsRef(this.ooid)
        .orderByChild('when')
        .startAt(this.whenStartFilter)
        .endAt(this.whenEndFilter)
        .once('value', snapshot=> {
          self.mappingsService
            .getEvents(snapshot).forEach(anEvent => {

            //NOTE: Need to add this extra check before adding object to array bec of unknown duplication
            if(!self.iEvents.filter(elem => {
                return elem.key === anEvent.key;
              }).length) {
              if (self.queryText.trim().length !== 0) {
                if (anEvent.name.toLowerCase().includes(self.queryText.toLowerCase()) || anEvent.description.toLowerCase().includes(self.queryText.toLowerCase()))
                  self.iEvents.push(anEvent);
              }else{
                self.iEvents.push(anEvent);
              }
            }
          });

          this.iEvents.sort(function(a, b) {
            return  new Date(b.when).getTime() - new Date(a.when).getTime()
          });

          //console.log(`startAt::${this.whenStartFilter}::endAt::${this.whenEndFilter}`)
          self.weekNumber += (self.pageSize + 1);
          self.events.publish('events:viewed');

          let startFrom: number = self.pageSize + self.weekNumber;

          let daysFrom:number = startFrom*7
          daysTo = (this.weekNumber*7)-6
          let startDate = Date.now() - daysFrom*24*3600*1000; // date n days ago in milliseconds UTC
          let endDateDate = Date.now() - (daysTo)*24*3600*1000; // date n days ago in milliseconds UTC
          this.whenStartFilter = new Date(startDate).toISOString().substring(0, 10);
          this.whenEndFilter = new Date(endDateDate).toISOString().substring(0, 10);

          self.loading = false;
        });
    }
  }

  notify(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  onNewEvent(){
    this.navCtrl.push('event-create', {'parentPage': this});
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EventListPage');
  }

  goToEventDetail(eventId){
    //console.log(`goToEventDetail::${eventId}`);
      this.navCtrl.push('event-detail', { 'parentPage': this, 'eventId': eventId });

    // this.events.subscribe('reloadPage1',() => {
    //   this.navCtrl.push('event-detail', { 'parentPage': this, 'eventId': eventId });
    // });

  }

  goToEventAttendees(eventId) {
    this.navCtrl.push('EventAttendeesPage', { 'parentPage': this,'eventId': eventId });
  }

  onSearchInput(){
    let self = this;
    if (self.queryText.trim().length !== 0) {
      //self.segment = 'current';
      // empty current threads
      this.loadEvents(false);
      // self.iEvents = [];
      // self.dataSvc.loadEvents().then(snapshot => {
      //   self.itemsSvc.reversedItems<IEvent>(self.mappingsService.getEvents(snapshot)).forEach(anEvent => {
      //     if (anEvent.name.toLowerCase().includes(self.queryText.toLowerCase()) || anEvent.description.toLowerCase().includes(self.queryText.toLowerCase()))
      //       self.iEvents.push(anEvent);
      //   });
      // });
    } else { // text cleared..
      this.loadEvents(true);
    }
  }

  selectPastEvents() {
    this.segment = "past";
    //this.setFilteredItems();
  }

  selectCurrentEvents() {
    this.segment = "current";
    //this.setFilteredItems();
  }

  goToEventComments(eventId: string) {
    //console.log(eventId);
    this.navCtrl.push('event-comments', {
      'eventId': eventId
    });
  }

  filterEvents(segment) {
    //console.log(`segment=${segment}::this.segment=${this.segment}::this.selectedSegment=${this.selectedSegment}`)
    if (this.selectedSegment !== this.segment) {
      this.selectedSegment = this.segment;
      //this.segment = segment;
      // if (this.selectedSegment === 'past')
      //   this.queryText = '';
      //this.queryText = '';
      if (this.internetConnected){
        this.loadEvents(true);
      }
      // Initialize

    } else {
      this.scrollToTop();
    }
  }
}
