import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "feed",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../feed/feed.module").then(m => m.FeedPageModule)
          }
        ]
      },
      {
        path: "event",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../event/event.module").then(m => m.EventModule)
          }
        ]
      },
      {
        path: "favorites",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../favorites/favorites.module").then(m => m.FavoritesPageModule)
          }
        ]
      },
      {
        path: "profile",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../profile/profile.module").then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/feed",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
