import {HttpClient} from 'aurelia-http-client';
import {inject} from 'aurelia-dependency-injection';

@inject(HttpClient)
export class TenantsService {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.tenantsDatabase = null;
    console.log('Service injected!')
  }

  getTenantsDatabase() {
    const url = 'https://my-json-server.typicode.com/martaProsniak/tenants-data/db';

    let promise = new Promise((resolve, reject) => {
      if(!this.tenantsDatabase){
        this.httpClient.get(url)
        .then(result => {
          this.tenantsDatabase = JSON.parse(result.response);
          resolve(this.tenantsDatabase)
        })
      }
      else{
        (resolve(this.tenantsDatabase))
      }
    });
    return promise;
  }
}
