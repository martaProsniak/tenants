import {inject} from 'aurelia-dependency-injection';
import {TenantsRepository} from 'tenantsRepository'

@inject(TenantsRepository)
export class App {
  message = 'Tenants';
  constructor(tenantsRepository){
    this.tenantsRepository = tenantsRepository;
    this.tenantsDb = [];
  }

  activate(){
   this.tenantsRepository.getTenantsDatabase();
  }
}
