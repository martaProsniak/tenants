import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-dependency-injection';

@inject(HttpClient)
export class TenantsService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  getTenantsDatabase() {
    const url = 'https://my-json-server.typicode.com/martaProsniak/tenants-data/db';
    return this.httpClient.get(url)
  }
}
