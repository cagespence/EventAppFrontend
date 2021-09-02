import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // TODO: add logic to redirect user here.
      this.splashScreen.hide();

      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          console.log("user is logged in");
          console.log("current", this.router.url);
          if (this.router.url != "/register/interests") {
            this.router.navigate(["members", "tabs", "feed"]);
          }
        } else {
          console.log("user is NOT logged in");
          this.router.navigate(["welcome"]);
        }
      });
    });
  }
}
