import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StorageService, AuthInfo } from "./storage.service";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);

  constructor(private plt: Platform, private storage: StorageService) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage
      .getAuthInfo()
      .then(result => {
        if (result.JWT) {
          // Todo: add expiry check on token here.
          this.authenticationState.next(true);
        }
      })
      .catch(error => {
        this.storage.setUpEmptyAuthInfoObj();
        console.log("error logging in: " + error);
      });
  }

  login(authInfo: AuthInfo) {
    this.storage
      .storeAuthInfo(authInfo)
      .then(result => {
        this.authenticationState.next(true);
      })
      .catch(error => {
        console.log("error logging in: " + error);
      });
  }

  logout() {
    this.storage
      .setUpEmptyAuthInfoObj()
      .then(() => {
        this.authenticationState.next(false);
      })
      .catch(error => {
        console.log("error logging out: " + error);
      });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
