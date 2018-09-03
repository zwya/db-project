import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  createForm: FormGroup;
  editMode: boolean = false;
  mainCategorySelect: boolean;
  subCategoryOneSelect: boolean;
  categoryValue: string;
  client: Client;
  categories: String[];
  categoryValueRadio: String;

  constructor(private clientService: ClientService, private router: Router, private route: ActivatedRoute, private categoryService: CategoryService) { }

  ngOnInit() {
    this.mainCategorySelect = true;
    this.categories = [];
    this.createForm = new FormGroup({
      title: new FormControl(''),
      name: new FormControl(''),
      jobtitle: new FormControl(''),
      organization: new FormControl(''),
      email: new FormControl(''),
      category: new FormControl(''),
      mobile: new FormControl(''),
      phone: new FormControl(''),
      fax: new FormControl(''),
      core: new FormControl(false),
      subcategory1: new FormControl(''),
      subcategory2: new FormControl('')
    });
    this.route.params.subscribe(
      params => {
        if(params['id']) {
          this.editMode = true;
          this.clientService.getClient(params['id']).subscribe(
            data => {
              this.createForm.setValue({
                title: data['title'],
                name: data['name'],
                jobtitle: data['job_title'],
                organization: data['organization'],
                email: data['email'],
                category: data['category'],
                mobile: data['mobile'],
                fax: data['fax'],
                phone: data['phone'],
                core: data['core'],
                subcategory1: data['subcategory'][0],
                subcategory2: data['subcategory'][1]
              });
              this.client = new Client(data['title'], data['name'], data['job_title'], data['organization'], data['email'], data['category'], data['core'], data['subcategory'], data['mobile'], data['phone'], data['fax'], data['_id']);
            }
          );
        }
      }
    );
  }

  onSubmit() {
    if(!this.editMode) {
      this.clientService.addClient(new Client(this.createForm.value.title, this.createForm.value.name, this.createForm.value.jobtitle, this.createForm.value.organization, this.createForm.value.email, this.createForm.value.category, this.createForm.value.core, [this.createForm.value.subcategory1, this.createForm.value.subcategory2], this.createForm.value.mobile, this.createForm.value.phone,
        this.createForm.value.fax))
      .subscribe(
        data => console.log(data)
      );
      this.router.navigate(['client', {add: true}]);
    }
    else{
      this.clientService.updateClient(new Client(this.createForm.value.title, this.createForm.value.name, this.createForm.value.jobtitle, this.createForm.value.organization, this.createForm.value.email, this.createForm.value.category, this.createForm.value.core, [this.createForm.value.subcategory1, this.createForm.value.subcategory2], this.createForm.value.mobile, this.createForm.value.phone,
        this.createForm.value.fax, this.client.id))
      .subscribe(
        data => console.log(data)
      );
      this.router.navigate(['client', {edit: true}]);
    }
  }

  selectMainCategory(type: string) {
    this.mainCategorySelect = true;
    this.categoryService.getCategories(type).subscribe(data => {
      var array = [];
      data['data'].forEach(function(element) {
        array.push(element['name']);
      });
      this.categories = array;
    });
  }

  selectSubCategory(type: string, whichSubCategory: string) {
    this.mainCategorySelect = false;
    this.categoryService.getCategories(type).subscribe(data => {
      var array = [];
      data['data'].forEach(function(element) {
        array.push(element['name']);
      });
      this.categories = array;
    });
    if(whichSubCategory == '1') {
      this.subCategoryOneSelect = true;
    }
    else {
      this.subCategoryOneSelect = false;
    }
  }

  setCategoryValue() {
    if(this.categoryValue && this.categoryValue != ""){
      if(this.mainCategorySelect) {
        this.createForm.patchValue({
          category: this.categoryValue
        });
      }
      else {
        if(this.subCategoryOneSelect) {
          this.createForm.patchValue({
            subcategory1: this.categoryValue
          });
        }
        else {
          this.createForm.patchValue({
            subcategory2: this.categoryValue
          });
        }
      }
      this.categoryValue = "";
    }
    else if(this.categoryValueRadio && this.categoryValueRadio != '') {
      if(this.mainCategorySelect) {
        this.createForm.patchValue({
          category: this.categoryValueRadio
        });
      }
      else {
        if(this.subCategoryOneSelect) {
          this.createForm.patchValue({
            subcategory1: this.categoryValueRadio
          });
        }
        else {
          this.createForm.patchValue({
            subcategory2: this.categoryValueRadio
          });
        }
      }
      this.categoryValueRadio = "";
    }
  }
}
