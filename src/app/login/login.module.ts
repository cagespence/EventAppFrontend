import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { LoginPage } from "./login.page";
import { EmailComponent } from "./email/email.component";
import { ApolloService } from "../services/apollo.service";
import { StorageService } from "../services/storage.service";

const routes: Routes = [
  {
    path: "",
    component: LoginPage
  },
  {
    path: "email",
    component: EmailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [ApolloService, StorageService],
  declarations: [LoginPage, EmailComponent]
})
export class LoginPageModule {}
