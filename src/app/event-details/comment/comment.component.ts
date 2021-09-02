import { Component, OnInit, Input } from "@angular/core";
import { CompactUser } from "src/app/services/apollo.service";
import { goToProfile } from 'src/utils/general';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';


export interface Comment {
  user: CompactUser;
  content: string;
  createdAt: string;
}

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.scss"]
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;

  constructor(private router: Router, private storage: StorageService) { }

  ngOnInit() { }

  goToProfile(id) {
    goToProfile(id, this.router, this.storage);
  }
}
