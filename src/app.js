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
    .then(() => {
      this.tenantsRepository.prepareData();
      this.tenants = this.tenantsRepository.tenants
      this.summary = this.tenantsRepository.tenantsMetaSummary;
    });
  }

  filterTenants(criteria){
    this.tenants = this.tenantsRepository.filterTenants(criteria);
  }

  searchTenants(criteria){
    this.tenants = this.tenantsRepository.searchTenants(criteria);
  }
}
