
export class TenantsService {
  constructor() {
    console.log('Service injected!')
    this.tenantsDatabase = {};
  }

  getTenantsDb() {
    const url = 'https://my-json-server.typicode.com/martaProsniak/tenants-data/db';

    fetch(url)
      .then(response => {
        if (response.status !== 200) {
          throw Error(`${response.status}: Something went wrong.`)
        } else {
          response.json()
        }
      })
      .then(json => {
        this.tenantsDatabase = json;
        console.log(this.tenantsDatabase)
        return this.tenantsDatabase;
      })
      .catch(err => console.log(err))
  }
}
