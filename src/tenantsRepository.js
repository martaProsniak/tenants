import { inject } from 'aurelia-dependency-injection';
import { TenantsService } from 'tenantsService'
import moment from 'moment'

@inject(TenantsService)
export class TenantsRepository {
  constructor(tenantsService) {
    this.tenantsService = tenantsService;
    this.tenantsDb = null;
    this.filterCriteria = ['All tenants', 'Demos', 'Enabled', 'Disabled']
  }

  getTenantsDatabase() {
    let promise = new Promise((resolve, reject) => {
        this.tenantsService.getTenantsDatabase()
          .then(result => {
            this.tenantsDb = JSON.parse(result.response);
            this.prepareData()
            resolve(this.tenants)
          })
      });
    return promise;
  }

  filterTenants(filterCriteria, tenants) {
    let filteredTenants = []
    if (filterCriteria === this.filterCriteria[0]) {
      return tenants;
    }
    else if (filterCriteria === this.filterCriteria[1]) {
      tenants.forEach(tenant => {
        if (tenant.IsDemoTenant) {
          filteredTenants.push(tenant)
        }
      });
    }
    else if (filterCriteria === this.filterCriteria[2]) {
      tenants.forEach(tenant => {
        if (tenant.IsEnabled) {
          filteredTenants.push(tenant)
        }
      });
    }
    else if (filterCriteria === this.filterCriteria[3]) {
      tenants.forEach(tenant => {
        if (!tenant.IsEnabled) {
          filteredTenants.push(tenant)
        }
      });
    }
    return filteredTenants;
  }

  searchTenants(searchCriteria, tenants){
    let criteria = searchCriteria.toLowerCase();
    let filteredTenants = [];
    tenants.forEach( tenant => {
      if (tenant.TenantDisplayName.toLowerCase().indexOf(criteria) >= 0){
        filteredTenants.push(tenant)
      }
      else if (tenant.DateCreated.indexOf(criteria) >= 0){
        filteredTenants.push(tenant)
      }
    });
    return filteredTenants;
  }

  prepareData() {
    this.tenantsRaw = this.getTenants();
    this.tenantsMetadata = this.getTenantsMetadata();
    this.tenantsMetaSummary = this.getTenantsMetaSummary();
    this.tenants = this.prepareTenantsDisplay();
  }

  getTenants() {
    return this.tenantsDb.tenants;
  }

  getTenantsMetadata() {
    return this.tenantsDb.tenantsMetadata;
  }

  mergeArrays(tenantsRaw, tenantsMetadata) {
    let mergedTenants = tenantsMetadata.map(tenantMeta =>
      // find tenant by id and merge into one object
      Object.assign({}, tenantMeta, tenantsRaw.find(tenant =>
        tenant.TenantId === tenantMeta.TenantId) || {})
    );
    return mergedTenants;
  }

  prepareTenantsDisplay() {
    // merge tenants info into one array
    let tenants = this.mergeArrays(this.tenantsRaw, this.tenantsMetadata);
    tenants.forEach(tenant => {
      // format date
      let dateCreated = moment(tenant.DateCreated)
        .format("MM.DD.YYYY, HH:mm:ss");
      tenant.DateCreated = dateCreated;
    })
    tenants = this.sortByDate(tenants);
    return tenants;
  }

  sortByDate(tenants){
    tenants.sort((a, b) => a.DateCreated >= b.DateCreated ? 1 : -1);
    return tenants;
  }

  getTenantsMetaSummary() {
    let tenantDemosCount = 0;
    let tenantEnabledCount = 0;
    let tenantDisabledCount = 0;
    let allTenantsCount = 0;

    this.tenantsMetadata.forEach(tenant => {
      if (tenant.IsDemoTenant) {
        tenantDemosCount++;
      }
      tenant.IsEnabled ? tenantEnabledCount++ : tenantDisabledCount++;
    });
    allTenantsCount = this.tenantsMetadata.length;
    return {tenantDemosCount: tenantDemosCount, tenantEnabledCount: tenantEnabledCount, tenantDisabledCount: tenantDisabledCount, allTenantsCount: allTenantsCount}
  }
}
