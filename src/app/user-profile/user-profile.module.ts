import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserProfilePage } from './user-profile.page';
import { ApolloService } from '../services/apollo.service';
import { StorageService } from '../services/storage.service';
import { SharedModule } from "../shared/shared.module";

const routes: Routes = [
  {
    path: ':id',
    component: UserProfilePage
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
  providers: [ApolloService, StorageService],
  declarations: [UserProfilePage]
})
export class UserProfilePageModule { }
