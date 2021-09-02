import { NgModule } from "@angular/core";
import { ApolloModule, APOLLO_OPTIONS, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { environment } from "../environments/environment";
import { ApolloLink, split } from "apollo-link";
import ApolloClient from "apollo-client";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { AuthInfo } from "./services/storage.service";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { getMainDefinition } from "apollo-utilities";

const uri = environment.backendGraphQLUrl; // Back-end URL.

export function provideApollo(httpLink: HttpLink) {
  // Code heavily based off of: https://medium.com/@avishwakarma/graphql-apollo-client-with-angular-v6-x-or-v7-x-and-jwt-tokens-9ab1a5d8439 🙏

  // Creating new HttpLink for Apollo Client
  const http = httpLink.create({ uri });

  // authContext to set Authorization token for every request sent from client
  const authContext = setContext(async (request, previousContext) => {
    // get the token from session or storage
    let existingAuthData: AuthInfo = await getAuthInfo();

    // existingAuthData = null; // TESTING PURPOSES - uncomment to ensure that no auth info is available and to throw GRAPHQL errors when querying/mutating.

    if (!existingAuthData) {
      return {};
    }
    // Set the Authorization headers
    return {
      headers: {
        Authorization: `${existingAuthData.JWT}`,
        UserEmail: `${existingAuthData.email}`
      }
    };
  });

  // Error handling for GraphQL client
  const error = onError(
    ({ graphQLErrors, networkError, response, operation }) => {
      // Checking GraphQL Errors
      if (graphQLErrors) {
        graphQLErrors.map(({ message, path }) => {
          console.log(`[GraphQL Error]: Message: ${message}`, path);
        });
      }
      // Checking in Network Errors
      if (networkError) {
        console.log(`[Network Error]:`, networkError);
      }
    }
  );

  // // Creating new WebSocketLink for ApolloClient to support GraphQL subscriptions
  // const ws = new WebSocketLink({
  //   uri: `ws:${environment.backendGraphQLUrl}`,
  //   options: {
  //     reconnect: true
  //   }
  // });

  // creating the conditional link for http and ws requests
  const link = split(({ query }) => {
    const { kind } = getMainDefinition(query);
    return kind === "OperationDefinition";
  }, ApolloLink.from([authContext, error, http]));

  // creating the final Apollo client link with all the parameters
  return new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "network-only"
      }
    }
  });
}

async function getAuthInfo(): Promise<AuthInfo> {
  return new Promise(async resolve => {
    let existingAuthData: AuthInfo = {
      JWT: null,
      email: null,
      id: null,
      tags: []
    };
    await new NativeStorage().getItem("authData").then(data => {
      existingAuthData = data as AuthInfo;
    });
    resolve(existingAuthData);
  });
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
