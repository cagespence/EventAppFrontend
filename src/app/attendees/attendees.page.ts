import { Component, OnInit, Input } from "@angular/core";
import { CompactUser, ApolloService } from "../services/apollo.service";

@Component({
  selector: "app-attendees",
  templateUrl: "./attendees.page.html",
  styleUrls: ["./attendees.page.scss"]
})
export class AttendeesPage implements OnInit {
  @Input() attendees: Array<CompactUser>;
  @Input() eventId: string;
  @Input() eventTitle: string;

  constructor(private apolloSerivce: ApolloService) {}

  ngOnInit() {
    console.log("got into attendess..");
    console.log(this.attendees);
  }

  async ionRefresh(event) {
    console.log("Pull Event Triggered!");
    setTimeout(async () => {
      console.log("Async operation has ended");
      const eventDetails = await this.apolloSerivce.getEventDetailsById(
        this.eventId
      );

      this.attendees = eventDetails.attendees;

      event.target.complete();
    }, 2000);
  }

  ionPull(event) {}

  ionStart(event) {}
}
