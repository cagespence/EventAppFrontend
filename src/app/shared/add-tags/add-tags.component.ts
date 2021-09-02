import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SelectTagsPage } from "../../select-tags/select-tags.page";
import { Tag } from '../tags/tags.component';

@Component({
  selector: "app-add-tags",
  templateUrl: "./add-tags.component.html",
  styleUrls: ["./add-tags.component.scss"]
})
export class AddTagsComponent implements OnInit {
  tags: Array<Tag> = Array();
  @Output() tagsAdded = new EventEmitter();

  @Input() selectedTags = Array<Tag>()

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    this.tags = []
    this.selectedTags.map(tag => {
      this.tags.push(tag)
    })
  }

  addTags() {
    console.log("Adding tags.");
    this.openModal();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: SelectTagsPage,
      componentProps: {
        userTags: this.selectedTags
      }
    });

    /**
     * Get list of tags returned from modal
     */
    modal.onDidDismiss().then(data => {
      const tags = data["data"]["tags"];
      this.tags = tags;
      console.log("selected tags");
      console.log(this.tags);
      this.tagsAdded.emit(this.tags);
    });

    return await modal.present();
  }
}
