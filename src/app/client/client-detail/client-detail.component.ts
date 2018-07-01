import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Client } from '../client.model';
import { ClientService } from '../client.service';


@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  client: Client;

  constructor(private route: ActivatedRoute, private clientService: ClientService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.clientService.getClient(params['id']).subscribe(
          data => this.client = new Client(data.title, data.name, data.job_title, data.organization, data.email, data.category, data.core, data.subcategory, data.mobile, data.phone, data.fax, data._id)
        );
      }
    );
  }

  deleteClient() {
    this.clientService.deleteClient(this.client.id).subscribe(
      data => console.log(data)
    );
    this.router.navigateByUrl('/client');
  }

}
