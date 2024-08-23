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

  getProduct(id:string):Observable<Product>{
    return this.http.get<Product>(`${environment.products}/${id}`);
  }

  checkProduct(id:string):Observable<any>{
    return this.http.get<any>(`${environment.products}/verification/${id}`)
  }

  getUpdate(product:Product, id:string):Observable<Product>{
    return this.http.put<Product>(`${environment.products}/${id}`,product);
  }

}
