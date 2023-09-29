import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(allProducts:any[],searchTerm:string,propsName:string): any[] {
    const result:any[]=[];

    if(!allProducts || searchTerm =='' ||propsName=='' ){
      return allProducts;
    }
    allProducts.forEach((products:any)=>{
      if(products[propsName].trim().toLowerCase().includes(searchTerm.trim().toLowerCase())){
        result.push(products)
      }
    })
    return result;
    
  }

}
