import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { FeedPage } from "./feed.page";
import { SharedModule } from "../shared/shared.module";
import { IonicModule } from "@ionic/angular";
import { EventComponent } from "./event/event.component";
import { StorageService } from "../services/storage.service";

const routes: Routes = [
  {
    path: "",
    component: FeedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [StorageService],
  declarations: [FeedPage, EventComponent]
})
export class FeedPageModule {}
