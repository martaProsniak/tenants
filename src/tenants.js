import {inject} from 'aurelia-dependency-injection';
import {TenantsRepository} from 'tenantsRepository'

@inject(TenantsRepository)
export class Tenants {
  constructor(tenantsRepository){
    this.tenantsRepository = tenantsRepository;
    this.tenantsDb = [];
    this.criteria = this.tenantsRepository.filterCriteria;
  }
  
  activate(){
    this.loadData();
  }

  loadData(){
    this.tenantsRepository.getTenantsDatabase()
    .then(() => {
      this.tenantsRaw = this.tenantsRepository.tenants
      this.tenants = this.tenantsRaw
      this.summary = this.tenantsRepository.tenantsMetaSummary;
    });
    if (this.filterCriteria) this.filterCriteria = null;
    if (this.searchCriteria) this.searchCriteria = null;
  }

  filterTenants(criteria){
    this.filterCriteria = criteria;
    //check if search is active
    if(this.searchCriteria){
      this.tenants = this.tenantsRepository.searchTenants(this.searchCriteria, this.tenantsRaw);
    } else this.tenants = this.tenantsRaw

    this.tenants = this.tenantsRepository.filterTenants(criteria, this.tenants);
  }

  searchTenants(criteria){
    this.searchCriteria = criteria;
    //check if filter is active
    if(this.filterCriteria){
      this.tenants = this.tenantsRepository.filterTenants(this.filterCriteria, this.tenantsRaw);
    } else this.tenants = this.tenantsRaw

    this.tenants = this.tenantsRepository.searchTenants(criteria, this.tenants);
  }
}
