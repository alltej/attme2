import {Component, OnInit, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, Tabs} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage({
  name: 'tabs'
})
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit {
  @ViewChild('forumTabs') tabRef: Tabs;

  tab1: any;
  tab2: any;

  public newThreads: string = '';
  public selectedTab: number = -1;

  constructor(public navCtrl: NavController,
              public authService: AuthProvider,
              public events: Events) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1 = 'EventListPage';
    this.tab2 = 'MemberListPage';
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
