import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  createForm: FormGroup;
  subCategories: string[] = [];
  editMode: boolean = false;
  client: Client;

  constructor(private clientService: ClientService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.createForm = new FormGroup({
      title: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      jobtitle: new FormControl('', Validators.required),
      organization: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      mobile: new FormControl(''),
      phone: new FormControl(''),
      fax: new FormControl(''),
      core: new FormControl(false),
      subcategory: new FormControl('');
    });
    this.route.params.subscribe(
      params => {
        if(params['id']) {
          this.editMode = true;
          this.clientService.getClient(params['id']).subscribe(
            data => {
              this.createForm.setValue({
                title: data.title,
                name: data.name,
                jobtitle: data.job_title,
                organization: data.organization,
                email: data.email,
                category: data.category,
                mobile: data.mobile,
                fax: data.fax,
                phone: data.phone,
                core: data.core,
                subcategory: ''
              });
              this.subCategories = data.subcategory;
              this.client = new Client(data.title, data.name, data.job_title, data.organization, data.email, data.category, data.core, data.subcategory, data.mobile, data.phone, data.fax, data._id);
            }
          );
        }
      }
    );
  }

  onSubmit() {
    if(!this.editMode) {
      this.clientService.addClient(new Client(this.createForm.value.title, this.createForm.value.name, this.createForm.value.jobtitle, this.createForm.value.organization, this.createForm.value.email, this.createForm.value.category, this.createForm.value.core, this.subCategories, this.createForm.value.mobile, this.createForm.value.phone,
        this.createForm.value.fax))
      .subscribe(
        data => console.log(data);
      );
    }
    else{
      this.clientService.updateClient(new Client(this.createForm.value.title, this.createForm.value.name, this.createForm.value.jobtitle, this.createForm.value.organization, this.createForm.value.email, this.createForm.value.category, this.createForm.value.core, this.subCategories, this.createForm.value.mobile, this.createForm.value.phone,
        this.createForm.value.fax, this.client.id))
      .subscribe(
        data => console.log(data);
      );
    }
    this.router.navigateByUrl('/client');
  }

  addSubCategory() {
    this.subCategories.push(this.createForm.value.subcategory);
  }

  removeSubCategory(index) {
    this.subCategories.splice(index, 1);
  }

}
