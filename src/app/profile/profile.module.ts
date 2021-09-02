import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProfilePage } from "./profile.page";
import { SharedModule } from "../shared/shared.module";
import { ApolloService } from "../services/apollo.service";
import { StorageService } from "../services/storage.service";
import { AuthenticationService } from "../services/authentication.service";
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: "",
    component: ProfilePage
  },
  {
    path: "edit",
    component: EditComponent
  },
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [ApolloService, StorageService, AuthenticationService],
  declarations: [ProfilePage, EditComponent]
})
export class ProfilePageModule { }
