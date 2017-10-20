import {Component, OnInit, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, Tabs} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit {
  @ViewChild('forumTabs') tabRef: Tabs;

  tab1: any= 'EventListPage';
  tab2: any= 'MemberListPage';

  public newThreads: string = '';
  public selectedTab: number = -1;

  constructor(public navCtrl: NavController,
              public authService: AuthProvider,
              public events: Events) {
  }

  ngOnInit() {
    this.startListening();
  }

  startListening() {
    var self = this;

    self.events.subscribe('event:created', (threadData) => {
      if (self.newThreads === '') {
        self.newThreads = '1';
      } else {
        self.newThreads = (+self.newThreads + 1).toString();
      }
    });

    self.events.subscribe('events:viewed', (threadData) => {
      self.newThreads = '';
    });
  }

  clicked() {
    var self = this;

    if (self.newThreads !== '') {
      self.events.publish('events:add');
      self.newThreads = '';
    }
  }
}
