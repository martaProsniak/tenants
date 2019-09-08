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
            console.log(this.tenantsDb)
            this.prepareData()
            resolve(this.tenantsDb)
          })
      });
    return promise;
  }

  filterTenants(filterCriteria) {
    let filteredTenants = []
    if (filterCriteria === this.filterCriteria[0]) {
      console.log(this.filterCriteria[0], filterCriteria)
      return this.tenants;
    }
    else if (filterCriteria === this.filterCriteria[1]) {
      this.tenants.forEach(tenant => {
        if (tenant.IsDemoTenant) {
          console.log(this.filterCriteria[1], filterCriteria)
          filteredTenants.push(tenant)
        }
      });
    }
    else if (filterCriteria === this.filterCriteria[2]) {
      this.tenants.forEach(tenant => {
        if (tenant.IsEnabled) {
          console.log(this.filterCriteria[2], filterCriteria)
          filteredTenants.push(tenant)
        }
      });
    }
    else if (filterCriteria === this.filterCriteria[3]) {
      this.tenants.forEach(tenant => {
        if (!tenant.IsEnabled) {
          console.log(this.filterCriteria[3], filterCriteria)
          filteredTenants.push(tenant)
        }
      });
    }
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

  mergeTenantsData(tenantsRaw, tenantsMetadata) {
    let mergedTenants = tenantsMetadata.map(tenantMeta =>
      // find tenant by id and merge into one object
      Object.assign({}, tenantMeta, tenantsRaw.find(tenant =>
        tenant.TenantId === tenantMeta.TenantId) || {})
    );
    return mergedTenants;
  }

  prepareTenantsDisplay() {
    // merge tenants info into one array
    let tenants = this.mergeTenantsData(this.tenantsRaw, this.tenantsMetadata);
    tenants.forEach(tenant => {
      // format date
      let dateCreated = moment(tenant.DateCreated)
        .format("MM.DD.YYYY, HH:mm:ss");
      tenant.DateCreated = dateCreated;
    })
    //sort by date
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

    this.tenantsMetadata.forEach(tenant => {
      if (tenant.IsDemoTenant) {
        tenantDemosCount++;
      }
      tenant.IsEnabled ? tenantEnabledCount++ : tenantDisabledCount++;
    });
    return { tenantDemosCount: tenantDemosCount, tenantEnabledCount: tenantEnabledCount, tenantDisabledCount: tenantDisabledCount }
  }
}
