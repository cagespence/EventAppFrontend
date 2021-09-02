import { Component, OnInit } from "@angular/core";
import { Tag } from "../shared/tags/tags.component";
import { CompactEvent } from "../feed/feed.page";
import { ModalController } from "@ionic/angular";
import { SelectTagsPage } from "../select-tags/select-tags.page";
import { ApolloService } from "src/app/services/apollo.service";
import { StorageService } from "src/app/services/storage.service";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  attending: Array<EventItem>;
  interests: Array<Tag>;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  bio: string;
  dob: string;
  interests: Array<Tag>;
  attending: Array<EventItem>;
  hosting: Array<EventItem>;
}

export interface EventItem {
  host: string;
  id: string;
  date: string;
  title: string;
}

@Component({
  selector: "app-profile",
  templateUrl: "profile.page.html",
  styleUrls: ["profile.page.scss"]
})
export class ProfilePage implements OnInit {
  newInterests: Array<number> = Array();
  hosting: Array<CompactEvent> = Array();
  interests: Array<Tag> = Array();
  attending: Array<CompactEvent> = Array();
  loading = false;
  profile: Profile;

  constructor(
    public modalController: ModalController,
    private apolloService: ApolloService,
    private storage: StorageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  async ngOnInit() {
    console.log("opening profile.");
    await this.getProfile();
  }

  async ionViewWillEnter() {
    await this.getProfile();
  }

  /**
   * Required callback for selecting a tag item
   *
   * todo: item should add a filter to feed and show events related to that tag
   *
   * @param tag: Tag item clicked
   */
  handleClick(tag: Tag) { }

  async openModal() {
    const modal = await this.modalController.create({
      component: SelectTagsPage,
      componentProps: {
        userTags: this.interests
      }
    });

    /**
     * Get list of tags returned from modal
     */
    modal.onDidDismiss().then(async data => {
      const tags: Array<Tag> = data["data"]["tags"];

      this.newInterests = []
      if (tags.length > 0) {
        tags.forEach(tag => {
          this.newInterests.push(parseInt(tag.id));
        });
      }

      const authInfo = await this.storage.getAuthInfo();

      await this.apolloService
        .addInterestsToUser(this.newInterests, parseInt(authInfo.id))
        .then(result => {
          if (result) {
            this.interests = tags;
            const tagIds = this.interests.map(t => parseInt(t.id));
            this.storage.updateUserTags(tagIds);
          }
        })
      await this.getProfile();
    });


    return await modal.present();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["login/email"]);
  }

  goToEventDetails(id) {
    this.router.navigate([
      `members/event-details/${id}`
    ]);
  }

  /**
   * TODO: implement routing to edit profile component
   */
  editProfile() {

  }

  async getProfile() {
    this.loading = true;
    try {
      const authInfo = await this.storage.getAuthInfo();

      this.profile = await this.apolloService.getProfile(authInfo.id);

      console.log(this.profile);
      console.log(this.profile.interests);

      this.interests = this.profile.interests;

      this.loading = false;
    } catch (e) {
      console.log("caught error - " + e);
    }
  }
}
