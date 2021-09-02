import { Injectable } from "@angular/core";
import { Tag } from "../shared/tags/tags.component";
import { ApolloService } from "./apollo.service";

@Injectable({
  providedIn: "root"
})
export class DataService {
  public tags: Array<Tag> = [];
  retrievedTags: Array<Tag> = [];

  constructor(private apollo: ApolloService) { }

  filterItems(searchTerm) {
    return this.tags.filter(tag => {
      return tag.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  getAllTags(): Promise<Array<Tag>> {
    return new Promise((resolve, reject) => {
      this.apollo.getTags().then(result => {
        console.log("got results from getTags in dataservice");
        console.log(result);
        this.tags = result;
        resolve(this.tags);
      });
    });
  }

  /**
   * Return list of selected tags in dataservice
   */
  getSelectedTags() {
    let tags = [];
    tags = this.tags.filter(tag => {
      return tag.selected == true;
    })
    console.log("tags---", tags);
    return tags
  }
}
