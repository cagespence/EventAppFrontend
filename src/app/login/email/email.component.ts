import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Router } from "@angular/router";
import { StorageService, AuthInfo } from "../../services/storage.service";
import { ApolloService } from "src/app/services/apollo.service";

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"]
})

// TODO: Add incorrect credentials validation via Apollo.
export class EmailComponent implements OnInit {
  authData = {
    username: "",
    password: ""
  };

  passwordIcon: string = "eye-off";

  showPassword(input: any): any {
    input.type = input.type === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }

  error = "";
  showError = false;
  missingInformationError = false;
  loading = false;

  constructor(private apollo: ApolloService, private router: Router) { }

  ngOnInit() { }

  async logIn() {
    this.missingInformationError = false;
    this.showError = false;

    if (!this.authData.username || !this.authData.password) {
      this.missingInformationError = true;
    } else {
      this.loading = true; // show loading icon
      try {
        const successfulLogin = await this.apollo.signIn(
          this.authData.username,
          this.authData.password
        );

        if (successfulLogin) {
          this.loading = false;
          this.router.navigate(["members", "tabs", "feed"]);
        }
      } catch (e) {
        console.log(e);
        this.error = e.toString().split(":")[3];
        this.showError = true;
        this.loading = false;
      }
    }
  }
}
