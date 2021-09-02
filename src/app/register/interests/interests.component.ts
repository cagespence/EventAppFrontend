import { Component, OnInit } from "@angular/core";
import { Tag } from "src/app/shared/tags/tags.component";
import { ApolloService } from "src/app/services/apollo.service";
import { StorageService } from "src/app/services/storage.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-interests",
  templateUrl: "./interests.component.html",
  styleUrls: ["./interests.component.scss"]
})
export class InterestsComponent implements OnInit {
  tags: Array<Tag>;
  selectedTags: Array<number>;
  loading = false;
  errorMessage = false;
  invalidInterestSelection = false;

  constructor(
    private apolloService: ApolloService,
    private storage: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.tags = await this.apolloService.getTags();
    this.loading = false;
  }

  /**
   * Required callback for selecting a tag item
   *
   * todo: item should add a filter to feed and show events related to that tag
   *
   * @param tag: Tag item clicked
   */
  handleClick(tag: Tag) {
    tag.selected = !tag.selected;
  }

  async addInterests() {
    try {
      if (this.validateSelectedInterests()) {
        const authInfo = await this.storage.getAuthInfo();

        await this.apolloService
          .addInterestsToUser(this.selectedTags, parseInt(authInfo.id))
          .then(async result => {
            if (result) {
              // this.interests = tags;
              // const tagIds = this.selectedTags.map(t => parseInt(t.id));
              await this.storage
                .updateUserTags(this.selectedTags)
                .then(result => {
                  this.router.navigate(["members", "tabs", "feed"]);
                });
            }
          });
      } else {
        this.invalidInterestSelection = true;
      }
    } catch (e) {
      console.log("caught error - " + e);
      this.errorMessage = true;
    }
  }

  validateSelectedInterests(): boolean {
    this.selectedTags = Array<number>();
    this.tags.forEach(t => {
      if (t.selected) {
        this.selectedTags.push(parseInt(t.id));
      }
    });

    if (this.selectedTags.length >= 3) {
      return true;
    } else {
      return false;
    }
  }
}
