import { Component, OnInit } from "@angular/core";
import gql from "graphql-tag";
import { Apollo } from "apollo-angular";
import {
  registerNewUserVariables,
  registerNewUser,
  emailAvailabilityVariables,
  emailAvailability
} from "src/app/types/schemaTypes";
import { extractDate } from "src/utils/general";
import { resolve } from "path";
import { Router } from "@angular/router";
import { AuthInfo, StorageService } from "src/app/services/storage.service";
import { ApolloService } from "src/app/services/apollo.service";

export interface CreateAccountData {
  email: string;
  password: string;
  name: string;
  birthday: string;
}

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"]
})
export class EmailComponent implements OnInit {
  accountData = {
    email: "",
    password: "",
    dob: "",
    name: ""
  };
  missingInformationError = false;
  emailInUseError = false;
  loading = false;
  captchaResponse = '';

  passwordIcon: string = "eye-off";

  constructor(
    private apollo: Apollo,
    private router: Router,
    private storage: StorageService,
    private apolloService: ApolloService
  ) { }

  showPassword(input: any): any {
    input.type = input.type === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }

  ngOnInit() { }

  async register() {
    this.missingInformationError = false;
    this.emailInUseError = false;

    const CREATE_USER = gql`
      mutation registerNewUser(
        $name: String!
        $dob: String!
        $email: String!
        $password: String!
      ) {
        createUser(
          name: $name
          dob: $dob
          bio: ""
          authProvider: { email: $email, password: $password }
        ) {
          id
          name
          email
        }
      }
    `;

    if (
      !this.accountData.email ||
      !this.accountData.password ||
      !this.accountData.dob ||
      !this.accountData.name ||
      !this.captchaResponse
    ) {
      this.missingInformationError = true;
    } else {
      this.loading = true; // show loading icon
      const emailValid = await this.checkIfEmailAvailable(
        this.accountData.email
      );

      if (!emailValid) {
        this.emailInUseError = true;
      } else {
        try {
          this.apollo
            .mutate<registerNewUser, registerNewUserVariables>({
              mutation: CREATE_USER,
              variables: {
                dob: extractDate(this.accountData.dob),
                email: this.accountData.email,
                name: this.accountData.name,
                password: this.accountData.password
              },
              update: cache => {
                // cache object here is used as a way to allow devs to have complete local state in order to seamlessly work in offline situations.
              }
            })
            .subscribe(
              async result => {
                if (result.data.createUser.id && result.data.createUser.email) {
                  this.loading = false;

                  await this.apolloService.signIn(
                    this.accountData.email,
                    this.accountData.password
                  );

                  this.router.navigate(["/register/interests"]);
                }
              },
              error => {
                console.log("Error logging in - reason:");
                console.log(error);
                this.loading = false;
                return error;
              }
            );
        } catch (e) {
          console.log("caught something in reg apollo: " + e);
        }
      }
    }
  }

  checkIfEmailAvailable(email: string): Promise<boolean> {
    const CHECK_EMAIL_AVAILABILITY = gql`
      query emailAvailability($email: String!) {
        isEmailAvailable(email: $email)
      }
    `;

    return new Promise(resolve => {
      this.apollo
        .watchQuery<emailAvailability, emailAvailabilityVariables>({
          query: CHECK_EMAIL_AVAILABILITY,
          variables: {
            email
          },
          fetchPolicy: "network-only" // Important, otherwise Query will not send a network request, instead work off the cached events.
        })
        .valueChanges.subscribe(
          async result => {
            resolve(result.data.isEmailAvailable);
          },
          error => {
            console.log("HANDLE ERROR.");
            console.log("Error getting events - reason:");
            console.log(error);
            return error;
          }
        );
    });
  }
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaResponse = captchaResponse
  }
}
