import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  searchTerm = new BehaviorSubject('') //To hold the search value 
  //Using BehaviorSubject to pass stream of data frrom one component to another component

   cartItemCount = new BehaviorSubject(0) //To hold cart item count


  constructor(private http:HttpClient) {
    this.cartCount()
   }
  //api function to get all products from the database

  BASE_URL = 'https://ecart-9llk.onrender.com'
  getAllProducts(){

    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }


  //api function to view particular products from the database
  viewProduct(id:any){
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)
  }

  //api function to add products to the wishlist
addToWishList(id:any,title:any,price:any,image:any){

  const body={
    id,
    title,
    price,
    image
  }
  return this.http.post(`${this.BASE_URL}/wishlists/add-to-wishlist`,body)
  
}

//api function to view items in the wishlist 
viewWishlist(){
  return this.http.get(`${this.BASE_URL}/wishlists/view-all-wishlist`)
}

//api function to delete the product in the wishlist
deleteWishlistProduct(id:any){
  return this.http.delete(`${this.BASE_URL}/wishlists/delete-wishlist-product/${id}`)

}

//api function for add to carts
addToCart(product:any){ //product is an object with properties
  //get the product details - id,title,price,image,quantity

  const body={
    id:product.id,
    title:product.title,
    price:product.price,
    image:product.image,
    quantity:product.quantity
  }
  return this.http.post(`${this.BASE_URL}/carts/add-to-cart`,body)


}

//getcart products
getCart(){
  return this.http.get(`${this.BASE_URL}/carts/get-cart`)
}


//To get cart products count
cartCount(){
 this.getCart().subscribe((result:any)=>{
  this.cartItemCount.next(result.length)
 })
}


//delete cart product
deleteProduct(id:any){
  return this.http.delete(`${this.BASE_URL}/carts/delete-product/${id}`)
}

//increment Quantity
incrementProduct(id:any){
  return this.http.get(`${this.BASE_URL}/carts/increment-product/${id}`)
}

//decrement quantity
decrementProduct(id:any){
  return this.http.get(`${this.BASE_URL}/carts/decrement-product/${id}`)
}
}


