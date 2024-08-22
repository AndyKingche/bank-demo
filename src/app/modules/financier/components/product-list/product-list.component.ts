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
  
  constructor(private financierService: FinancierService) { }

  ngOnInit(): void {

    this.getlistProduct();
    
  }
  
  async getlistProduct(){
    
    try {    
      this.financierService.getlistProduct().subscribe((resp:any)=>{
        if(resp){
          this.listProduct = resp.data; 
          
        }
      });

      
    } catch (error) {
      console.log('ERROR EN GETLISTPRODUCT' , error);
    }

  }

}
