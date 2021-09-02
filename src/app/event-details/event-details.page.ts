import { Component, OnInit } from "@angular/core";
import { ApolloService, CompactUser } from "../services/apollo.service";
import { Tag } from "../shared/tags/tags.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Comment, CommentComponent } from "./comment/comment.component";
import { StorageService } from "../services/storage.service";
import { goToProfile, isLoggedInUser } from "src/utils/general";
import { AlertController, ModalController } from "@ionic/angular";
import { AttendeesPage } from "../attendees/attendees.page";

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  host: CompactUser;
  imageUrl: string;
  address: string;
  comments: Array<Comment>;
  attendees: Array<CompactUser>;
  tags: Array<Tag>;
  isAttending: boolean;
  isLiked: boolean;
  isHost: boolean;
  favoriteCount: number;
}

@Component({
  selector: "app-event-details",
  templateUrl: "./event-details.page.html",
  styleUrls: ["./event-details.page.scss"]
})
export class EventDetailsPage implements OnInit {
  currentEventDetails: EventDetails;
  loading = true;
  showComments = true;
  commentContent = "";
  loadJoinLeaveBtn = false;

  constructor(
    private apolloService: ApolloService,
    private activatedRoutes: ActivatedRoute,
    private storage: StorageService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.currentEventDetails = {
      id: "",
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      date: "",
      host: null,
      imageUrl: "",
      address: "",
      comments: [],
      attendees: [],
      tags: [],
      isAttending: false,
      isLiked: false,
      isHost: false,
      favoriteCount: 0
    };
    console.log("entered event details");
    this.loading = true;
    let retrievedEventId: string;
    this.activatedRoutes.params.subscribe(params => {
      retrievedEventId = params["id"];
    });
    this.currentEventDetails = await this.apolloService.getEventDetailsById(
      retrievedEventId
    );

    console.log(this.currentEventDetails);

    if (this.currentEventDetails.comments.length <= 0) {
      this.showComments = false;
    }

    console.log(this.currentEventDetails);

    this.loading = false;
  }

  async showAttendees() {
    console.log("clicked attendees...");
    const modal = await this.modalController.create({
      component: AttendeesPage,
      componentProps: {
        attendees: this.currentEventDetails.attendees,
        eventId: this.currentEventDetails.id,
        eventTitle: this.currentEventDetails.title
      }
    });

    return await modal.present();
  }

  async deleteEvent() {
    console.log("attempting to delete an event as host.");

    const alert = await this.alertController.create({
      header: "Careful!",
      message: "Are you sure you want to delete this event?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: "Delete",
          cssClass: "delete-alert-button",
          handler: async () => {
            console.log(
              "Deleteing the event with id " + this.currentEventDetails.id
            );
            const deletedSuccessfully = await this.apolloService.deleteEventById(
              this.currentEventDetails.id
            );
            if (deletedSuccessfully) {
              this.router.navigate(["members", "tabs", "feed"]);
            } else {
              // TODO: error handling.
            }
          }
        }
      ]
    });

    await alert.present();
  }

  editEvent() {
    this.router.navigate([`members/event-edit/${this.currentEventDetails.id}`]);
  }

  async favoriteEvent() {
    const favorited = await this.apolloService.favoriteEvent(
      parseInt(this.currentEventDetails.id)
    );

    if (favorited) {
      this.currentEventDetails.isLiked = true;
      this.currentEventDetails.favoriteCount++;
    } else {
      // TODO: error handling.
    }
  }

  async unfavoriteEvent() {
    const unfavorited = await this.apolloService.unfavoriteEvent(
      parseInt(this.currentEventDetails.id)
    );

    if (unfavorited) {
      this.currentEventDetails.isLiked = false;
      this.currentEventDetails.favoriteCount--;
    } else {
      // TODO: error handling.
    }
  }

  async addNewComment() {
    const authInfo = await this.storage.getAuthInfo();

    if (this.commentContent.length > 0) {
      const comment = (await this.apolloService.addCommentToEvent(
        parseInt(authInfo.id),
        parseInt(this.currentEventDetails.id),
        this.commentContent
      )) as Comment;

      this.currentEventDetails.comments.push(comment);
      this.showComments = !this.showComments ? true : true;
      this.commentContent = "";
    } else {
      this.showCommentWarning();
    }
  }

  handleClick(tag: Tag) {}

  goToProfile(id) {
    console.log("going to prof");
    goToProfile(id, this.router, this.storage);
  }

  async attendEvent() {
    this.loadJoinLeaveBtn = true;

    const attending = await this.apolloService.attendEvent(
      this.currentEventDetails.id
    );

    if (attending) {
      this.currentEventDetails.isAttending = true;
    } else {
      // TODO: handle error.
    }

    this.loadJoinLeaveBtn = false;
  }

  async toggleAttending(isAttending) {
    isAttending ? this.unattendEvent() : this.attendEvent();
  }

  getAttendingText(isAttending) {
    return isAttending ? "leave event" : "join event";
  }

  async unattendEvent() {
    this.loadJoinLeaveBtn = true;

    const unattending = await this.apolloService.unattendEvent(
      this.currentEventDetails.id
    );

    if (unattending) {
      this.currentEventDetails.isAttending = false;
    } else {
      // TODO: handle error.
    }

    this.loadJoinLeaveBtn = false;
  }

  async showCommentWarning() {
    const alert = await this.alertController.create({
      header: "Missing content!",
      message: "Please actually type a comment.",
      buttons: [
        {
          text: "Ok",
          role: "cancel"
        }
      ]
    });
    await alert.present();
  }

  getFavoriteCount() {
    return this.currentEventDetails.favoriteCount;
  }

  async ionRefresh(event) {
    // this.loading = true;
    console.log("Pull Event Triggered!");
    setTimeout(async () => {
      console.log("Async operation has ended");
      this.currentEventDetails = await this.apolloService.getEventDetailsById(
        this.currentEventDetails.id
      );

      // this.loading = true;

      event.target.complete();
    }, 2000);
  }

  ionPull(event) {}

  ionStart(event) {}
}
