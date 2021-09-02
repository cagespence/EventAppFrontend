import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { ApolloService } from "../services/apollo.service";
import { StorageService } from "../services/storage.service";
import { EventDetailsPage } from "./event-details.page";
import { SharedModule } from "../shared/shared.module";
import { CommentComponent } from "./comment/comment.component";

const routes: Routes = [
  {
    path: ":id",
    component: EventDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [ApolloService, StorageService],
  declarations: [EventDetailsPage, CommentComponent]
})
export class EventDetailsPageModule {}
