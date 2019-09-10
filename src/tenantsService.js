import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-dependency-injection';

@inject(HttpClient)
export class TenantsService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  getTenantsDatabase() {
    const url = 'https://my-json-server.typicode.com/martaProsniak/tenants-data/';
    return this.httpClient.get(url + 'db')
      .then(result => result.response)
  }
}
