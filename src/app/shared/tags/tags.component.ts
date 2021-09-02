import { Component, OnInit, Input } from "@angular/core";

export interface Tag {
  id: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: "app-tags",
  templateUrl: "./tags.component.html",
  styleUrls: ["./tags.component.scss"]
})
export class TagsComponent implements OnInit {
  @Input() tags: Array<Tag>;

  ////// required by implementing class
  /*
   * In implementing classes page typeScript file, create a handleClick(Tag) function to handle the onclick function of a tag
   * !! don't forget to include this callback in the element as <app-tags [handleClick]=handleClick> !!
  */
  @Input() handleClick: Function;


  constructor() { }

  ngOnInit() { }
}
