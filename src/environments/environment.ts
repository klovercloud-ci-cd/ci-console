
const webappUrl = 'http://localhost:2022';

export const environment = {
  appUrl: webappUrl,
  production: true,
  /*v1AuthEndpoint: 'http://192.168.68.130:4200/api/v1/',
  v1ApiEndPoint: 'http://192.168.68.130:4202/api/v1/',*/
  v1AuthEndpoint: 'http://192.168.68.139:8085/api/v1/',
  v1ApiEndPoint: 'http://192.168.68.139:8080/api/v1/',
  v1ApiEndPointWS: 'ws://192.168.68.139:8080/api/v1/',
  // v1AuthEndpoint: 'http://192.168.68.139:8085/api/v1/',
  // v1ApiEndPoint: 'http://192.168.68.139:8080/api/v1/',
  // v1ApiEndPointWS: 'ws://192.168.68.139:8080/api/v1/',
}
