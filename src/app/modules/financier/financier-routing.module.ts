import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductAddComponent } from './components/product-add/product-add.component';

const routes: Routes = [
  {path: 'product-list', component: ProductListComponent},
  {path:'', redirectTo: 'product-list', pathMatch:'full'},
  {path: 'product-add', component: ProductAddComponent},
  {path:'product-edit/:id', component:ProductAddComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancierRoutingModule { }
