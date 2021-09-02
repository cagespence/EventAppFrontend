import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { RegisterPage } from "./register.page";
import { EmailComponent } from "./email/email.component";
import { StorageService } from "../services/storage.service";
import { InterestsComponent } from "./interests/interests.component";
import { SharedModule } from "../shared/shared.module";
import { ApolloService } from "../services/apollo.service";
import { RecaptchaModule } from 'ng-recaptcha';

const routes: Routes = [
  {
    path: "",
    component: RegisterPage
  },
  {
    path: "email",
    component: EmailComponent
  },
  {
    path: "interests",
    component: InterestsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    RecaptchaModule
  ],
  providers: [StorageService, ApolloService],
  declarations: [RegisterPage, EmailComponent, InterestsComponent]
})
export class RegisterPageModule { }
