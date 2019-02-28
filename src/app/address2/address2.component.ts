import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address2',
  templateUrl: './address2.component.html',
  styleUrls: ['./address2.component.css']
})
export class Address2Component implements OnInit {
  @Input() address: FormGroup;
  @Input() identifier: string;
  public summary: string;
  public isCollapsed: false;

  i: string;

  constructor() { }

  ngOnInit() {
    this.i = this.identifier;

    this.address.valueChanges.subscribe(value => {
      if (this.address.valid) {
        this.summary = `${value.line1}, ${value.town} ${value.postCode}`;
      } else {
        this.summary = '';
      }
      // this.summary = `${this.address.get('line1').value}, ${this.address.get('town').value} ${this.address.get('postcode').value}`;
    });
  }

}
