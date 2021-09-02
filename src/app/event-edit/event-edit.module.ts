import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ApolloService } from "../services/apollo.service";
import { StorageService } from "../services/storage.service";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { EventEditPage } from "./event-edit.page";

const routes: Routes = [
  {
    path: ":id",
    component: EventEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [StorageService, ApolloService],
  declarations: [EventEditPage]
})
export class EventEditPageModule {}
