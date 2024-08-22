import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', redirectTo: 'product-list', pathMatch:'full'},
  {
    path:'product-list',
    loadChildren : ()=> import('./modules/financier/financier.module').then(m => m.FinancierModule)
  },{
    path: '**', redirectTo: 'product-list'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
