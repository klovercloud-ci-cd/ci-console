// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const webappUrl = 'http://localhost:2022';

export const environment = {
  appUrl: webappUrl,
  production: false,
  // v1AuthEndpoint: 'http://192.168.68.114:4200/api/v1/',
  // v1ApiEndPoint: 'http://192.168.68.114:4202/api/v1/',
  v1AuthEndpoint: 'http://192.168.68.129:8085/api/v1/',
  v1ApiEndPoint: 'http://192.168.68.129:8080/api/v1/',
  v1ApiEndPointWS: 'ws://192.168.68.129:8080/api/v1/',
};
