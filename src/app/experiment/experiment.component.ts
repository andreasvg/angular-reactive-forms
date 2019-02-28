import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { fbind } from 'q';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {

  filterForm: FormGroup;
  test: string;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      filter: ''
    });

    this.filterForm.get('filter').valueChanges.subscribe(value => this.test = value);
  }

}
