import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthInfo, StorageService } from "src/app/services/storage.service";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { AddEvent, AddEventVariables } from "src/app/types/schemaTypes";
import {
  arePropertiesEmpty,
  extractDate,
  extractTime,
  getTimeAsNumberOfMinutes
} from "src/utils/general";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Tag } from "src/app/shared/tags/tags.component";

export interface EventBaseInfo {
  title: string;
  address: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
  host: number;
  tags: Array<number>;
}

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  tagsSelected: Array<number> = Array(); // just need tag's id for the backend.
  selectedTags: Array<Tag> = Array();
  uploadedImageUrl: string;
  showUploadedImage = false;

  // Private variables
  private formObj: FormGroup;
  private eventObj: EventBaseInfo;

  constructor(
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private apollo: Apollo,
    private alertController: AlertController,
    private router: Router
  ) {
    // form using formBuilder to group variables
    this.formObj = this.formBuilder.group({
      title: ["", Validators.required],
      address: ["", Validators.required],
      description: ["", Validators.required],
      date: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required]
    });
  }

  async validateEvent() {
    this.eventObj = this.formObj.value as EventBaseInfo;

    const authInfo: AuthInfo = await this.storage.getAuthInfo();
    this.eventObj.host = parseInt(authInfo.id);
    this.eventObj.startTime = extractTime(this.eventObj.startTime.toString());
    this.eventObj.endTime = extractTime(this.eventObj.endTime.toString());
    this.eventObj.date = extractDate(this.eventObj.date);

    // TODO: get back to this when image upload service is here.
    this.eventObj.imageUrl = this.uploadedImageUrl;

    // TODO: get back to this when adding tags service is here.
    this.eventObj.tags = this.tagsSelected;

    if (
      arePropertiesEmpty(this.eventObj) &&
      this.checkTimeValidity(this.eventObj)
    ) {
      this.addEvent(this.eventObj);
    } else {
      this.presentAlertConfirm();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Missing inputs!",
      message: "Please fill in all details of the event.",
      buttons: [
        {
          text: "Ok",
          role: "cancel"
        }
      ]
    });

    await alert.present();
  }

  validateEventllEnter() {
    console.log("ionViewWillEnter");
    // form using formBuilder to group variables
    this.uploadedImageUrl = "";
    this.showUploadedImage = false;
    this.formObj = this.formBuilder.group({
      title: ["", Validators.required],
      address: ["", Validators.required],
      description: ["", Validators.required],
      date: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required]
    });
  }

  checkTimeValidity(event: EventBaseInfo): boolean {
    const startTimeInMinutes = getTimeAsNumberOfMinutes(event.startTime);
    const endTimeInMinutes = getTimeAsNumberOfMinutes(event.endTime);
    const resultTimeInMinutes = endTimeInMinutes - startTimeInMinutes;

    if (resultTimeInMinutes <= 0) {
      this.presentTimeErrorAlert();
      return false;
    }
    return true;
  }

  async presentTimeErrorAlert() {
    const alert = await this.alertController.create({
      header: "time error",
      message: "the input start time and end time are not valid.",
      buttons: ["OK"]
    });

    await alert.present();
  }

  setEventTags(tags: Array<Tag> = Array()) {
    console.log("caught emit from child..");
    this.tagsSelected = [];
    this.selectedTags = tags;
    if (tags.length > 0) {
      tags.forEach(t => {
        this.tagsSelected.push(parseInt(t.id));
      });
    }
    console.log("selected tags in parent:");
    console.log(this.tagsSelected);
  }

  ngOnInit() {}

  setEventImage(imageUrl) {
    console.log("got in parent the following img url:");
    console.log(imageUrl);
    this.uploadedImageUrl = imageUrl;
    this.showUploadedImage = true;
    console.log(this.showUploadedImage);
  }

  addEvent(event: EventBaseInfo) {
    const ADD_EVENT = gql`
      mutation AddEvent(
        $title: String!
        $description: String!
        $date: String!
        $host: Int!
        $startTime: String!
        $endTime: String!
        $address: String!
        $imageUrl: String!
        $tags: [Int!]
      ) {
        createEvent(
          title: $title
          description: $description
          date: $date
          host: $host
          startTime: $startTime
          endTime: $endTime
          address: $address
          imageUrl: $imageUrl
          tags: { tagIds: $tags }
        ) {
          title
          id
        }
      }
    `;

    this.apollo
      .mutate<AddEvent, AddEventVariables>({
        mutation: ADD_EVENT,
        variables: {
          address: event.address,
          date: event.date,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          title: event.title,
          imageUrl: event.imageUrl,
          host: event.host,
          tags: event.tags
        }
      })
      .subscribe(
        async result => {
          if (result.data.createEvent.id) {
            // this.router.navigate([
            //   `members/event-details/${result.data.createEvent.id}`
            // ]);
            this.router.navigate(["members", "tabs", "feed"], {
              queryParams: {
                createdEvent: true,
                eventTitle: result.data.createEvent.title,
                eventId: result.data.createEvent.id
              }
            });
          }
        },
        error => {
          console.log("HANDLE ERROR.");
          console.log("Error getting events - reason:");
          console.log(error);
          return error;
        }
      );
  }
}
