import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("../tabs/tabs.module").then(m => m.TabsPageModule)
  },
  {
    path: "profile",
    loadChildren: "../profile/profile.module#ProfilePageModule"
  },
  { path: "feed", loadChildren: "../feed/feed.module#FeedPageModule" },
  { path: "event", loadChildren: "../event/event.module#EventModule" },
  {
    path: "select-tags",
    loadChildren: "../select-tags/select-tags.module#SelectTagsPageModule"
  },
  {
    path: "event-details",
    loadChildren: "../event-details/event-details.module#EventDetailsPageModule"
  },
  {
    path: "user-profile",
    loadChildren: "../user-profile/user-profile.module#UserProfilePageModule"
  },
  {
    path: "event-edit",
    loadChildren: "../event-edit/event-edit.module#EventEditPageModule"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
