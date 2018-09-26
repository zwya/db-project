import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { CategoryService } from '../category.service';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css']
})
export class ClientSearchComponent implements OnInit {
  createForm: FormGroup;
  advanced: boolean;
  mainCategorySelect: boolean;
  subCategoryOneSelect: boolean;
  clientsQueried: boolean;
  hasMorePages: boolean;
  categoryValue: string;
  categories: String[];
  categoryValueRadio: String;
  clients: any;
  query: any;
  pageNumber: number;
  limit: number;
  hoverIndex: number;


  constructor(private categoryService: CategoryService, private clientService: ClientService,) { }

  ngOnInit() {
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
    this.advanced = false;
    this.clientsQueried = false;
    this.limit = 10;
    this.pageNumber = 1;
  }

  toggleAdvancedContorls() {
    this.advanced = !this.advanced;
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

  exportFile() {
    this.clientService.downloadCSV(new Client(this.createForm.value.title, this.createForm.value.name, this.createForm.value.jobtitle, this.createForm.value.organization, this.createForm.value.email, this.createForm.value.category, this.createForm.value.core, '',[this.createForm.value.subcategory1, this.createForm.value.subcategory2], this.createForm.value.mobile, this.createForm.value.phone,
      this.createForm.value.fax))
    .subscribe(
      //data => FileSaver.saveAs(data.file, "output.csv")
      data => {
        var blob = new Blob([data['file']], {type: "text/csv;charset=utf-8}"});
        FileSaver.saveAs(blob, "output.csv");
      }
    );
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
      query['subcategory'] = JSON.stringify(subcategory);
    }
    if(query['jobtitle']) {
      query['job_title'] = query['jobtitle'];
      delete query['jobtitle'];
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

  setIndex(index){
    this.hoverIndex = index;
  }

  clearIndex() {
    this.hoverIndex = null;
  }

}
