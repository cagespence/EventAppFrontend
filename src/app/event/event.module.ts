import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { StorageService } from "../services/storage.service";

const routes: Routes = [
  {
    path: "",
    component: CreateComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [StorageService],
  declarations: [CreateComponent]
})
export class EventModule {}
