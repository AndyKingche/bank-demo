import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FinancierService {

  constructor(private http: HttpClient) { }

  getlistProduct():Observable<any>{
    return this.http.get(`${environment.products}`)
  }

  addProduct(product:Product): Observable<Product>{
    return this.http.post<Product>(`${environment.products}`, product);
  }



}
