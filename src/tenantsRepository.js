import { inject } from 'aurelia-dependency-injection';
import { TenantsService } from 'tenantsService'
import moment from 'moment'

@inject(TenantsService)
export class TenantsRepository {
  constructor(tenantsService) {
    this.tenantsService = tenantsService;
    this.tenantsDb = null;
    this.tenantsMetaSummary = {}
    console.log('Repository injected!')

  }

  getTenantsDatabase() {
    let promise = new Promise((resolve, reject) => {
      if (!this.tenantsDatabase) {
        this.tenantsService.getTenantsDatabase()
          .then(result => {
            this.tenantsDb = JSON.parse(result.response);
            console.log(this.tenantsDb)
            resolve(this.tenantsDb)
          })
      }
      else {
        (resolve(this.tenantsDb))
      }
    });
    return promise;
  }

  prepareData() {
    this.tenants = this.getAndSortTenants();
    this.tenantsMetadata = this.getTenantsMetadata();
    this.tenantsMetaSummary = this.getTenantsMetaSummary();
    this.tenantsDisplay = this.prepareTenantsDisplay();
    console.log(this.tenantsDb, this.tenants, this.tenantsMetadata, this.tenantsDisplay, this.tenantsMetaSummary)
  }

  getAndSortTenants() {
    let tenants = this.tenantsDb.tenants.sort((a, b) =>
      a.DateCreated >= b.DateCreated ? 1 : -1);
    return tenants;
  }

  getTenantsMetadata() {
    let tenantsMetadata = this.tenantsDb.tenantsMetadata;
    return tenantsMetadata;
  }

  mergeTenantsData() {
    let mergedTenants = this.tenantsMetadata.map(tenantMeta =>
      Object.assign({}, tenantMeta, this.tenants.find(tenant =>
        tenant.TenantId === tenantMeta.TenantId) || {})
    );
    return mergedTenants;
  }

  prepareTenantsDisplay() {
    let tenantsDisplay = this.mergeTenantsData();
    tenantsDisplay.forEach(tenant => {
      let dateCreated = moment(tenant.DateCreated)
        .format("MM.DD.YYYY, HH:mm:ss");
      tenant.DateCreated = dateCreated;
    })
    return tenantsDisplay;
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
