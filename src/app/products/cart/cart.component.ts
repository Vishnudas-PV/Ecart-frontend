import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  //paypal variable
  public payPalConfig?: IPayPalConfig;

//variable for show paypal button
 showPayPalButton:boolean=false;

  //paypal boolean
  showSuccess:boolean=false;

  proceedToPaymentStatus: boolean = false;
  //used to hide discount coupan
  discountStatus: boolean = false;

  //used to show offers
  offerclicked: boolean = false;

  //To hold delivery Information
  name: string = ''
  houseNumber: string = ''
  streetName: string = ''
  state: string = ''
  pincode: string = ''
  mobileNumber: string = ''




  allCart: any = [];//To hold cart products
  cartTotalPrice = 0;
  constructor(private api: ApiService, private cartfb: FormBuilder) { }
  ngOnInit(): void {

    this.api.getCart().subscribe((result) => {
      console.log(result);
      this.allCart = result;
      this.getCartTotal()
      //paypal function
      this.initConfig()

    }, (result: any) => {
      console.log(result.error);

    })

  }


  //deletecart
  deleteCartProduct(id: any) {
    this.api.deleteProduct(id).subscribe((result: any) => {
      //result?  -  Remaining products
      this.allCart = result;
      this.api.cartCount();
      this.getCartTotal()

    })
  }

  //get cart total
  getCartTotal() {
    let total = 0;
    this.allCart.forEach((item: any) => {
      total += item.grandTotal
      this.cartTotalPrice = Math.ceil(total);
    })
  }

  //increment Qunatity
  incrementCartProduct(id: any) {
    this.api.incrementProduct(id).subscribe((result: any) => {
      this.allCart = result;
      this.getCartTotal()

    }, (result: any) => {
      alert(result.error)
    })

  }

  //decrement quantity
  decrementCartProduct(id: any) {
    this.api.decrementProduct(id).subscribe((result: any) => {
      this.allCart = result;
      this.getCartTotal()
    }, (result: any) => {
      alert(result.error)
    })
  }

  //address form

  addressForm = this.cartfb.group({
    name: [''],
    houseNumber: [''],
    streetName: [''],
    state: [''],
    pinNumber: [''],
    mobileNumber: [''],

  })

  submitForm() {
    if (this.addressForm.valid) {
      this.proceedToPaymentStatus = true;
      this.name = this.addressForm.value.name || '';
      this.houseNumber = this.addressForm.value.houseNumber || '';
      this.streetName = this.addressForm.value.streetName || '';
      this.state = this.addressForm.value.state || '';
      this.pincode = this.addressForm.value.pinNumber || '';
      this.mobileNumber = this.addressForm.value.mobileNumber || '';

    }
    else {


      alert('Please Enter a valid Details')

    }
  }

  //offer button
  offerClicked() {
    this.offerclicked = true;

  }
  discountTotal(value: any) {
    this.cartTotalPrice = this.cartTotalPrice * (100 - value) / 100;
    this.discountStatus = true;

  }



  private initConfig(): void {
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '9.99',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  makePayment(){
    this.showPayPalButton=true
  }
}