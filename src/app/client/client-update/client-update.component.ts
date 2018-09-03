import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { CategoryService } from '../category.service';
import { UpdaterequestService } from '../updaterequest.service';

@Component({
  selector: 'app-client-update',
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css']
})
export class ClientUpdateComponent implements OnInit {
  createForm: FormGroup;
  mainCategorySelect: boolean;
  subCategoryOneSelect: boolean;
  categoryValue: string;
  categories: String[];
  categoryValueRadio: String;
  query: any;
  private pageNumber: number;
  private limit: number;
  private hasMorePages: boolean;
  private clientsQueried: boolean;
  private hoverIndex: number;
  private clients: any;
  private clientSelected: boolean;
  private requestSubmitted: boolean;

  constructor(private clientService: ClientService, private categoryService: CategoryService, private updateRequestService: UpdaterequestService) { }

  ngOnInit() {
    this.pageNumber = 1;
    this.limit = 10;
    this.mainCategorySelect = true;
    this.categories = [];
    this.clientsQueried = false;
    this.clientSelected = false;
    this.requestSubmitted = false;
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

  queryClients() {
    var allEmpty = true;
    var query = {};
    for(var key in this.createForm.value) {
      if(this.createForm.value[key] != '') {
        query[key] = this.createForm.value[key];
        allEmpty = false;
      }
    }
    var subcategory = [];
    if(query['subcategory1']) {
      subcategory.push(query['subcategory1']);
      delete query['subcategory1'];
    }
    if(query['subcategory2']) {
      subcategory.push(query['subcategory2']);
      delete query['subcategory2'];
    }
    if(subcategory.length > 0) {
      query['subcategory'] = subcategory;
    }
    if(!allEmpty) {
      this.clientService.getClientsMultipleQueries(this.pageNumber, this.limit, query).subscribe(data => {
        this.clients = data['clients'];
        this.query = query;
        this.clientsQueried = true;
        this.hasMorePages = data['has_more'];
      });
    }
  }

  setIndex(index){
    this.hoverIndex = index;
  }

  clearIndex() {
    this.hoverIndex = null;
  }

  nextPage() {
    if(this.hasMorePages) {
      this.pageNumber++;
      this.clientService.getClientsMultipleQueries(this.pageNumber, this.limit, this.query).subscribe(data => {
        this.clients = data['clients'];
        this.hasMorePages = data['has_more'];
      });
    }
  }

  previousPage() {
    if(this.pageNumber > 1) {
      this.pageNumber--;
      this.clientService.getClientsMultipleQueries(this.pageNumber, this.limit, this.query).subscribe(data => {
        this.clients = data['clients'];
        this.hasMorePages = data['has_more'];
      });
    }
  }

  goToDetails() {
    this.clientSelected = true;
    this.createForm.setValue({
      title: this.clients[this.hoverIndex]['title'],
      name: this.clients[this.hoverIndex]['name'],
      jobtitle: this.clients[this.hoverIndex]['job_title'],
      organization: this.clients[this.hoverIndex]['organization'],
      email: this.clients[this.hoverIndex]['email'],
      category: this.clients[this.hoverIndex]['category'],
      mobile: this.clients[this.hoverIndex]['mobile'],
      fax: this.clients[this.hoverIndex]['fax'],
      phone: this.clients[this.hoverIndex]['phone'],
      core: this.clients[this.hoverIndex]['core'],
      subcategory1: this.clients[this.hoverIndex]['subcategory'][0],
      subcategory2: this.clients[this.hoverIndex]['subcategory'][1]
    });
  }

  onSubmit() {
    var fieldsToUpdate = [];
    var values = [];

    if(this.createForm.value.title != this.clients[this.hoverIndex]['title']) {
      fieldsToUpdate.push('title');
      values.push({'newvalue': this.createForm.value.title, 'oldvalue': this.clients[this.hoverIndex]['title']});

    }

    if(this.createForm.value.name != this.clients[this.hoverIndex]['name']) {
      fieldsToUpdate.push('name');
      values.push({'newvalue': this.createForm.value.name, 'oldvalue': this.clients[this.hoverIndex]['name']});
    }

    if(this.createForm.value.jobtitle != this.clients[this.hoverIndex]['job_title']) {
      fieldsToUpdate.push('job_title');
      values.push({'newvalue': this.createForm.value.jobtitle, 'oldvalue': this.clients[this.hoverIndex]['job_title']});
    }

    if(this.createForm.value.organization != this.clients[this.hoverIndex]['organization']) {
      fieldsToUpdate.push('organization');
      values.push({'newvalue': this.createForm.value.organization, 'oldvalue': this.clients[this.hoverIndex]['organization']});
    }

    if(this.createForm.value.email != this.clients[this.hoverIndex]['email']) {
      fieldsToUpdate.push('email');
      values.push({'newvalue': this.createForm.value.email, 'oldvalue': this.clients[this.hoverIndex]['email']});
    }


    if(this.createForm.value.category != this.clients[this.hoverIndex]['category']) {
      fieldsToUpdate.push('category');
      values.push({'newvalue': this.createForm.value.category, 'oldvalue': this.clients[this.hoverIndex]['category']});
    }

    if(this.createForm.value.mobile != this.clients[this.hoverIndex]['mobile']) {
      fieldsToUpdate.push('mobile');
      values.push({'newvalue': this.createForm.value.mobile, 'oldvalue': this.clients[this.hoverIndex]['mobile']});
    }

    if(this.createForm.value.phone != this.clients[this.hoverIndex]['phone']) {
      fieldsToUpdate.push('phone');
      values.push({'newvalue': this.createForm.value.phone, 'oldvalue': this.clients[this.hoverIndex]['phone']});
    }

    if(this.createForm.value.fax != this.clients[this.hoverIndex]['fax']) {
      fieldsToUpdate.push('fax');
      values.push({'newvalue': this.createForm.value.fax, 'oldvalue': this.clients[this.hoverIndex]['fax']});
    }

    if(this.createForm.value.subcategory1 != this.clients[this.hoverIndex]['subcategory'][0]) {
      fieldsToUpdate.push('subcategory1');
      values.push({'newvalue': this.createForm.value.subcategory1, 'oldvalue': this.clients[this.hoverIndex]['subcategory'][0]});
    }

    if(this.createForm.value.subcategory2 != this.clients[this.hoverIndex]['subcategory'][1]) {
      fieldsToUpdate.push('subcategory2');
      values.push({'newvalue': this.createForm.value.subcategory2, 'oldvalue': this.clients[this.hoverIndex]['subcategory'][1]});
    }

    if( this.createForm.value.core != this.clients[this.hoverIndex]['core']) {
      fieldsToUpdate.push('core');
      values.push({'newvalue': this.createForm.value.core, 'oldvalue': this.clients[this.hoverIndex]['core']});
    }

    if(fieldsToUpdate.length > 0) {
      this.updateRequestService.addRequest(this.clients[this.hoverIndex]['id'], fieldsToUpdate, values).subscribe(
         data => {
           console.log(data);
         }
       );
    }

  }
}
