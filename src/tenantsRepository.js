import {inject} from 'aurelia-dependency-injection';
import { TenantsService } from 'tenantsService'

@inject(TenantsService)
export class TenantsRepository{
  constructor(tenantsService){
    this.tenantsService = tenantsService;
    this.tenantsDb = [];
    console.log('Repository injected!')
  }

  getTenantsDatabase(){

  }
}
