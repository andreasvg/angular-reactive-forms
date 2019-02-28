import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { Customer } from './customer';
import { formControlBinding } from '@angular/forms/src/directives/ng_model';

/* function ratingRangeValidator(c: AbstractControl): {[key: string]: boolean} | null {
  if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
    return { 'range': true};
  }

  return null;
} */

function ratingRangeValidator(minVal: number, maxVal: number): ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean} | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < minVal || c.value > maxVal)) {
      return { 'range': true};
    }
    // everything OK, so return null:
    return null;
  };
}

function emailMatch(c: AbstractControl): {[key: string]: boolean} | null {
  const pwd = c.get('email');
  const conf = c.get('confirmEmail');

  if (pwd.pristine || conf.pristine) { return null; }

  if (pwd.value === conf.value) {
    return null;
  }

  return { 'match': true};
}


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;

  private validationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  };

  get addresses(): FormArray{
    return <FormArray>this.customerForm.get('addresses');
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        confirmEmail: ['', [Validators.email, Validators.required]],
      }, {validator: emailMatch }),
      phone: '',
      notification: 'email',
      rating: [null, [ratingRangeValidator(1, 5)]],
      sendCatalog: true,
      addresses: this.fb.array([this.buildAddress()])
    });

    // this.customerForm.valueChanges.subscribe(value => console.log(JSON.stringify(value)));
    // this.customerForm.get('emailGroup').valueChanges.subscribe(value => console.log(JSON.stringify(value)));
    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value));

    const emailCtrl = this.customerForm.get('emailGroup.email');
    emailCtrl.valueChanges.pipe(debounceTime(2000)).subscribe(value => this.setMessage(emailCtrl));
      ;

/*     emailCtrl.valueChanges.subscribe(
      value => this.setMessage(emailCtrl)); */
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm));
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      line1: '',
      line2: '',
      town: '',
      county: '',
      postCode: ''
    });
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  setNotification(notifyVia: string): void {
    switch (notifyVia) {
      case 'email':
        this.customerForm.get('phone').clearValidators();
        this.customerForm.get('emailGroup.email').setValidators([Validators.required, Validators.email]);
        break;
      case 'text':
        this.customerForm.get('emailGroup.email').clearValidators();
        this.customerForm.get('phone').setValidators([Validators.required]);
      default:
        break;
    }
    this.customerForm.get('phone').updateValueAndValidity();
    this.customerForm.get('emailGroup.email').updateValueAndValidity();
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.validationMessages[key]).join(' ');
    }
  }
}
