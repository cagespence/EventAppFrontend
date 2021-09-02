import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// GraphQL related modules
import { GraphQLModule } from "./graphql.module";
import { HttpClientModule } from "@angular/common/http";

// Native storage modules
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { SelectTagsPageModule } from "./select-tags/select-tags.module";
import { AttendeesPageModule } from "./attendees/attendees.module";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    SelectTagsPageModule,
    AttendeesPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
