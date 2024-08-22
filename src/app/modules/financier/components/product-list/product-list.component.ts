import { Component, OnInit } from '@angular/core';
import { FinancierService } from '../../services/financier.service';
import { Product } from '../../models/product.model';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  listProduct : Product[] = [];
  filterProduct : Product[] = []; // se creó para poder tener los productos filtrados de la busqueda
  searchControl = new FormControl('');

  
  constructor(private financierService: FinancierService) { }

  ngOnInit(): void {

    this.getlistProduct();

    this.searchControl.valueChanges.subscribe(value =>{
      this.filterProduct = this.listProduct.filter(product=> 
        product.name.toLowerCase().includes(value.toLowerCase()));
    });

    
  }
  
  async getlistProduct(){
    
    try {    
      this.financierService.getlistProduct().subscribe((resp:any)=>{
        if(resp){
          this.listProduct = resp.data; 
          this.filterProduct = resp.data;
          
        }
      });

      
    } catch (error) {
      console.error('ERROR EN GETLISTPRODUCT' , error);
    }

  }

}
