import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { StorageService, AuthInfo } from "../services/storage.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { AuthenticationService } from "../services/authentication.service";
import {
  getEventsByTagsVariables,
  getEventsByTags
} from "../types/schemaTypes";

export interface CompactEvent {
  id: string;
  title: string;
  imageUrl: string;
  startTime: string;
  date: string;
  isAttending?: boolean;
}

export interface CompactEventInfo {
  event: CompactEvent;
  isLiked: boolean;
  isAttending: boolean;
  isHost: boolean;
  favoriteCount: number;
  attendeeCount: number;
}

export interface User {
  id: string;
  name: string;
  dob: string;
  bio: string;
}

@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"]
})
export class FeedPage implements OnInit {
  events: Array<CompactEventInfo> = Array<CompactEventInfo>();
  userTags: Array<number> = Array();

  page: number = 0;
  rates: any;
  loading = true;
  error: any;

  showAddMoreTagsMessage = false;
  showEmptyListMessage = false;

  constructor(
    private apollo: Apollo,
    private storage: StorageService,
    private activatedRouter: ActivatedRoute,
    private toastController: ToastController,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }


  addNewEvent() {
    this.router.navigate([`members/tabs/event`]);
  }

  addNewTags() {
    this.router.navigate([`members/tabs/profile`]);
  }

  async getEvents(
    tags: Array<number>,
    page: number
  ): Promise<Array<CompactEventInfo>> {
    const retrievedEvents = Array<CompactEventInfo>();

    const GET_EVENTS_BY_TAG = gql`
      query getEventsByTags($tags: [Int!], $page: Int!, $amountPerPage: Int!) {
        events(
          filter: { tagIds: $tags }
          paginationPage: $page
          paginationAmount: $amountPerPage
        ) {
          event {
            id
            title
            imageUrl
            startTime
            date
            favorites {
              id
            }
            attendees {
              user {
                id
                email
              }
            }
          }
          isLiked
          isAttending
          isHost
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.apollo
        .watchQuery<getEventsByTags, getEventsByTagsVariables>({
          query: GET_EVENTS_BY_TAG,
          variables: {
            tags,
            amountPerPage: 5,
            page
          },
          fetchPolicy: "network-only" // Important, otherwise Query will not send a network request, instead work off the cached events.
        })
        .valueChanges.subscribe(
          async result => {
            if (result.data.events.length > 0) {
              result.data.events.forEach(data => {
                const eventData = data.event;

                if (eventData.imageUrl == "") {
                  // Set back-up picture is no picture is saved.
                  eventData.imageUrl =
                    "https://billfish.org/wp-content/uploads/2019/08/placeholder-image.jpg";
                }

                const castedEvent = eventData as CompactEvent;

                const eventInfo: CompactEventInfo = {
                  event: castedEvent,
                  isAttending: data.isAttending,
                  isLiked: data.isLiked,
                  isHost: data.isHost,
                  favoriteCount: data.event.favorites.length,
                  attendeeCount: data.event.attendees.length
                };

                retrievedEvents.push(eventInfo);
              });
            }
            resolve(retrievedEvents);
          },
          error => {
            console.log("HANDLE ERROR.");
            console.log("Error getting events - reason:");
            console.log(error);
            return error;
          }
        );
    });
  }

  async getUserTags() {
    return (await this.storage.getAuthInfo()).tags;
  }

  // async ionViewWillEnter() {

  // }

  async ngOnInit() {
    await this.onEnter();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/members/tabs/feed') {
        this.onEnter();
      }
    });

    this.activatedRouter.queryParams.subscribe(params => {
      if (params.createdEvent && params.eventTitle && params.eventId) {
        console.log(params.eventId);
        this.presentNewEventToast(params.eventTitle, params.eventId);
      }
    });
  }

  async onEnter() {
    this.userTags = await this.getUserTags();
    this.events = await this.getEvents(this.userTags, 0);

    // Show empty message if array of events is empty.
    if (this.events.length <= 0) {
      this.showEmptyListMessage = true;
    } else {
      this.showEmptyListMessage = false;
    }
  }

  async presentNewEventToast(eventTitle: string, eventId: number) {
    const toast = await this.toastController.create({
      message: "Your event is now public!",
      position: "bottom",
      cssClass: "tabs-bottom",
      duration: 2000,
      buttons: [
        {
          text: "View",
          handler: () => {
            this.router.navigate([`members/event-details/${eventId}`]);
          }
        },
        {
          text: "Ok",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    toast.present();
  }

  async ionRefresh(event) {
    this.showAddMoreTagsMessage = false;
    console.log("Pull Event Triggered!");
    this.page = 0;
    setTimeout(async () => {
      console.log("Async operation has ended");
      this.events = await this.getEvents(this.userTags, 0);

      if (this.events.length <= 0) {
        this.showEmptyListMessage = true;
      } else {
        this.showEmptyListMessage = false;
      }

      event.target.complete();
    }, 2000);
  }

  ionPull(event) { }

  ionStart(event) { }

  loadData(event) {
    setTimeout(async () => {
      this.showAddMoreTagsMessage = false;
      this.page++;
      let retrievedEvents = await this.getEvents(this.userTags, this.page);

      let newEvents: Array<CompactEventInfo> = Array();
      retrievedEvents.forEach(eventInfo => {
        if (
          !this.events.find(e => {
            return e.event.id === eventInfo.event.id;
          })
        ) {
          // if matches don't add
          newEvents.push(eventInfo);
        }
      });

      // No new events found.
      if (newEvents.length <= 0) {
        this.showAddMoreTagsMessage = true;
      } else {
        this.events = this.events
          .concat(newEvents)
          .filter(function (elem, index, self) {
            return index === self.indexOf(elem);
          });
      }

      event.target.complete();
    }, 1500);
  }
}
