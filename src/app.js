import {inject} from 'aurelia-dependency-injection';
import {TenantsRepository} from 'tenantsRepository'

@inject(TenantsRepository)
export class App {
  message = 'Tenants';
  constructor(tenantsRepository){
    this.tenantsRepository = tenantsRepository;
    this.tenantsDb = [];
    this.criteria = this.tenantsRepository.filterCriteria;
  }
  
  activate(){
    this.tenantsRepository.getTenantsDatabase()
    .then((result) => {
      this.tenantsRepository.prepareData();
      this.tenants = this.tenantsRepository.tenants
      this.summary = this.tenantsRepository.tenantsMetaSummary;
      console.log(result)
    });
  }

  filterTenants(criteria){
    this.tenants = this.tenantsRepository.filterTenants(criteria);
    console.log(this.tenants)
  }
}
