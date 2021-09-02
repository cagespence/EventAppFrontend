// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Want to run on an actual device with the dev server? set the backendGraphQLUrl as your local machine's IP.
// Example: It goes from http://localhost:8080/graphql to http://192.168.2.9:8080/graphql

const baseUrl = "https://192.168.43.207:8443";

export const environment = {
  production: false,
  // backendGraphQLUrl: "http://localhost:8080/graphql"
  backendUrl: `${baseUrl}`,
  backendGraphQLUrl: `${baseUrl}/graphql`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
