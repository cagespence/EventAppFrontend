import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { StorageService } from "./services/storage.service";

const routes: Routes = [
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  {
    path: "welcome",
    loadChildren: "./welcome/welcome.module#WelcomePageModule"
  },
  {
    path: "register",
    loadChildren: "./register/register.module#RegisterPageModule"
  },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule" },
  {
    path: "members",
    canActivate: [AuthGuard],
    loadChildren: "./member/member-routing.module#MemberRoutingModule"
  },  { path: 'attendees', loadChildren: './attendees/attendees.module#AttendeesPageModule' },
  { path: 'favorites', loadChildren: './favorites/favorites.module#FavoritesPageModule' }

  // { path: 'user-profile', loadChildren: './user-profile/user-profile.module#UserProfilePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [StorageService],
  exports: [RouterModule]
})
export class AppRoutingModule {}
