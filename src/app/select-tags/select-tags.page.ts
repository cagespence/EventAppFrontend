import { Component, OnInit, Input } from "@angular/core";
import { Tag } from "../shared/tags/tags.component";
import { DataService } from "../services/data.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-select-tags",
  templateUrl: "./select-tags.page.html",
  styleUrls: ["./select-tags.page.scss"]
})
export class SelectTagsPage implements OnInit {
  @Input() userTags: Array<Tag>;
  public searchTerm: string = "";
  public tags: Array<Tag>;

  handleClick(tag) {
    tag.selected = !tag.selected;
  }

  constructor(
    private dataService: DataService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.dataService.getAllTags().then(result => {
      result.map(tag => {
        tag.selected = false;
      });
    });
    console.log(this.userTags);
    this.setFilteredItems();
    if (this.userTags) {
      this.setSelected(this.userTags);
    }
  }

  submit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data

    // console.log(this.dataService.getSelectedTags());

    this.modalController.dismiss({
      tags: this.dataService.getSelectedTags()
    });
  }

  setFilteredItems() {
    this.tags = this.dataService.filterItems(this.searchTerm);
    console.log(this.tags);
  }

  setSelected(tags) {
    tags.forEach(tag => {
      this.tags.forEach(myTag => {
        if (myTag.name == tag.name) {
          myTag.selected = true;
        }
      });
    });
  }
}
