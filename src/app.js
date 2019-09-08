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
    this.tenantsRepository.getTenantsDatabase()
    .then((result) => {
      this.tenantsRepository.prepareData();
      this.tenants = this.tenantsRepository.tenantsDisplay
      this.summary = this.tenantsRepository.tenantsMetaSummary;
      console.log(result)
    });
    
  }
}
