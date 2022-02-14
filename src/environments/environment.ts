// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {getConfig} from "./environment.common";

const webappUrl = 'http://localhost:2022';

/*const CONFIG = {
  host: 'http://192.168.68.140:3000/api/v1',
  //host: 'http://localhost:8080',
  port: '',
  postfix: '/',
  // mockPoint: './assets/mock-data/',
  get apiEndPoint() {
    return `${this.host}${this.port}${this.postfix}`;
  }
};*/
export const environment = {
  appUrl: webappUrl,
  production: false,
  v1AuthEndpoint: 'http://localhost:3000/api/v1/',
  v1ApiEndPoint: 'http://localhost:3000/api/v1/',
  // config: {
  //   ...getConfig(CONFIG)
  // },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
