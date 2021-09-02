import { Component, OnInit, Input } from "@angular/core";
import { CompactEvent, CompactEventInfo } from "../feed.page";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { AuthInfo, StorageService } from "src/app/services/storage.service";
import {
  attendEvent,
  attendEventVariables,
  unattendEvent,
  unattendEventVariables
} from "src/app/types/schemaTypes";
import { Router, NavigationExtras } from "@angular/router";
import { prettifyTime, prettifyDate } from "src/utils/general";
import { ApolloService } from "src/app/services/apollo.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"]
})
export class EventComponent implements OnInit {
  @Input() eventInfo: CompactEventInfo;

  prettifiedDate: string;
  prettifiedStartTime: string;
  loadJoinLeaveBtn = false;

  constructor(
    private apollo: Apollo,
    private apolloService: ApolloService,
    private storage: StorageService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ionViewWillEnter() {

  }

  deleteEvent() {
    console.log("attempting to delete an event as host.");
    this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Careful!",
      message: "Are you sure you want to delete this event?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: handle => {
          }
        },
        {
          text: "Delete",
          cssClass: "delete-alert-button",
          handler: () => {
            console.log("Confirm Okay");
          }
        }
      ]
    });

    await alert.present();
  }


  ngOnInit() {
    this.prettifiedDate = prettifyDate(this.eventInfo.event.date);
    this.prettifiedStartTime = prettifyTime(this.eventInfo.event.startTime);
  }

  goToEventDetails() {
    if (this.eventInfo.event.id) {
      this.router.navigate([
        `members/event-details/${this.eventInfo.event.id}`
      ]);
    }
  }

  async favoriteEvent() {
    const favorited = await this.apolloService.favoriteEvent(
      parseInt(this.eventInfo.event.id)
    );

    if (favorited) {
      this.eventInfo.isLiked = true;
      this.eventInfo.favoriteCount++

    } else {
      // TODO: error handling.
    }
  }

  async unfavoriteEvent() {
    const unfavorited = await this.apolloService.unfavoriteEvent(
      parseInt(this.eventInfo.event.id)
    );

    if (unfavorited) {
      this.eventInfo.isLiked = false;
      this.eventInfo.favoriteCount--
    } else {
      // TODO: error handling.
    }
  }

  async attendEvent() {
    this.loadJoinLeaveBtn = true;

    const attending = await this.apolloService.attendEvent(
      this.eventInfo.event.id
    );

    if (attending) {
      this.eventInfo.isAttending = true;
    } else {
      // TODO: handle error.
    }

    this.loadJoinLeaveBtn = false;
  }

  async unattendEvent() {
    this.loadJoinLeaveBtn = true;

    const unattending = this.apolloService.unattendEvent(
      this.eventInfo.event.id
    );

    if (unattending) {
      this.eventInfo.isAttending = false;
    } else {
      // TODO: handle error.
    }

    this.loadJoinLeaveBtn = false;
  }
}
