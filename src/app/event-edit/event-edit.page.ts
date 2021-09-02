import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import {
  extractDate,
  arePropertiesEmpty,
  getTimeAsNumberOfMinutes
} from "src/utils/general";
import { Tag } from "../shared/tags/tags.component";
import { EventDetails } from "../event-details/event-details.page";
import { ApolloService, UpdateEventDetails } from "../services/apollo.service";

@Component({
  selector: "app-event-edit",
  templateUrl: "./event-edit.page.html",
  styleUrls: ["./event-edit.page.scss"]
})
export class EventEditPage implements OnInit {
  eventDetails: EventDetails;

  newTagsIdSelected: Array<number> = Array(); // just need tag's id for the backend.
  tagsSelected: Array<Tag> = Array();
  uploadedImageUrl: string;
  showUploadedImage = false;
  eventId;
  loaded = false;

  updatedStartTime;
  updatedEndTime;
  currentImageUrl;

  // Private variables
  formObj: FormGroup;
  private eventObj: UpdateEventDetails;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoutes: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private apollo: ApolloService
  ) { }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    this.activatedRoutes.params.subscribe(params => {
      this.eventId = params["id"];
    });
    this.eventDetails = await this.apollo.getEventDetailsById(
      this.eventId,
      false,
      false
    );

    this.currentImageUrl = this.eventDetails.imageUrl;
    this.updatedStartTime = this.eventDetails.startTime;
    this.updatedEndTime = this.eventDetails.endTime;

    // form using formBuilder to group variables
    this.formObj = this.formBuilder.group({
      title: [this.eventDetails.title, Validators.required],
      address: [this.eventDetails.address, Validators.required],
      description: [this.eventDetails.description, Validators.required],
      date: [this.eventDetails.date, Validators.required],
      startTime: [this.eventDetails.startTime, Validators.required],
      endTime: [this.eventDetails.endTime, Validators.required]
    });



    this.tagsSelected = this.eventDetails.tags;

    this.newTagsIdSelected = [];
    if (this.tagsSelected.length > 0) {
      this.tagsSelected.forEach(t => {
        this.newTagsIdSelected.push(parseInt(t.id));
      });
    }

    console.log(this.tagsSelected);
    this.uploadedImageUrl = this.eventDetails.imageUrl;
    this.loaded = true;
  }

  async validateEvent() {
    this.eventObj = this.formObj.value as UpdateEventDetails;

    this.eventObj.startTime = this.updatedStartTime.substring(0, 5);
    this.eventObj.endTime = this.updatedEndTime.substring(0, 5);
    this.eventObj.date = extractDate(this.eventObj.date);
    this.eventObj.eventId = parseInt(this.eventDetails.id);
    this.eventObj.imageUrl = this.currentImageUrl;
    this.eventObj.tagIds = this.newTagsIdSelected;

    console.log(this.eventObj);
    if (
      arePropertiesEmpty(this.eventObj) &&
      this.checkTimeValidity(this.eventObj)
    ) {
      this.updateEvent(this.eventObj);
    } else {
      this.presentAlertConfirm();
    }
  }

  async updateEvent(data: UpdateEventDetails) {
    const updateSuccessful = this.apollo.updateEvent(data);
    if (updateSuccessful) {
      this.router.navigate([`members/event-details/${this.eventDetails.id}`]);
    }
  }

  async showHelpAlert() {
    const alert = await this.alertController.create({
      header: "Notifications",
      message:
        "Ticking the checkbox will notify your event's attendees about the update via push notifications.",
      buttons: ["OK"]
    });

    await alert.present();
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

  checkTimeValidity(event: UpdateEventDetails): boolean {
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
    this.newTagsIdSelected = [];
    if (tags.length > 0) {
      tags.forEach(t => {
        this.newTagsIdSelected.push(parseInt(t.id));
      });
    }
    console.log("selected tags in parent:");
    console.log(this.newTagsIdSelected);
  }

  setEventImage(imageUrl) {
    this.currentImageUrl = imageUrl;
  }
}
