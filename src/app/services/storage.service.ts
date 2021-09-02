import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { AuthenticationService } from "./authentication.service";

export interface AuthInfo {
  email: string;
  JWT: string;
  id: string;
  tags: Array<number>;
}

@Injectable()
export class StorageService {
  constructor(private nativeStorage: NativeStorage) {}

  async storeAuthInfo(authInfo: AuthInfo) {
    await this.nativeStorage.setItem("authData", authInfo).then(
      () => {
        console.log("Stored item!");
        console.log(authInfo);
      },
      error => console.error("Error storing item", error)
    );
  }

  async setUpEmptyAuthInfoObj() {
    const authInfo: AuthInfo = { JWT: "", email: "", id: "", tags: [] };
    this.nativeStorage
      .setItem("authData", authInfo)
      .then(
        () => console.log("Stored item!"),
        error => console.error("Error storing item", error)
      );
  }

  async getAuthInfo(): Promise<AuthInfo> {
    return new Promise(async (resolve, reject) => {
      let existingAuthData = null;
      await this.nativeStorage
        .getItem("authData")
        .then(data => {
          existingAuthData = data as AuthInfo;
        })
        .catch(error => {
          reject(error);
        });

      resolve(existingAuthData);
    });
  }

  async updateUserTags(newTags: Array<number>) {
    const currentAuthInfo = await this.getAuthInfo();
    const newAuthInfo: AuthInfo = {
      JWT: currentAuthInfo.JWT,
      email: currentAuthInfo.email,
      id: currentAuthInfo.id,
      tags: newTags
    };
    await this.storeAuthInfo(newAuthInfo);
  }

  async clearAuthInfo(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.nativeStorage
        .clear()
        .then(result => {
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
