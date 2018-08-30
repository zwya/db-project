import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: any;
  private pageNumber: number;
  private limit: number;
  private hasMorePages: boolean;
  private hoverIndex: number;
  private searchField: string = 'name';
  private searchQuery: string;
  private userAdded: boolean;
  private userEdited: boolean;

  constructor(private clientService: ClientService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.pageNumber = 1;
    this.limit = 10;
    this.getClients();
    this.hoverIndex = null;
    this.route.params.subscribe(
      params => {
        if(params['add']) {
          this.userAdded = true;
        }
        else {
          this.userAdded = false;
        }
        if(params['edit']){
          this.userEdited = true;
        }
        else {
          this.userEdited = false;
        }
      });
  }

  nextPage() {
    if(this.hasMorePages) {
      this.pageNumber++;
      this.getClients();
    }
  }

  previousPage() {
    if(this.pageNumber > 1) {
      this.pageNumber--;
      this.getClients();
    }
  }

  getClients() {
    if(this.searchQuery && this.searchQuery.length > 0) {
      this.clientService.getClients(this.pageNumber, this.limit, this.searchField + "=" + this.searchQuery).subscribe(
        data => {
          this.clients = data['clients'];
          this.hasMorePages = data['has_more'];
        }
      );
    }
    else {
      this.clientService.getClients(this.pageNumber, this.limit).subscribe(
        data => {
          this.clients = data['clients'];
          this.hasMorePages = data['has_more'];
        }
      );
    }
  }

  setIndex(index){
    this.hoverIndex = index;
  }

  clearIndex() {
    this.hoverIndex = null;
  }

  goToDetails() {
    this.router.navigateByUrl('/client/details/' + this.clients[this.hoverIndex].id);
  }

  searchClients(event) {
    if(event.key ==  "Enter") {
      if(this.searchQuery && this.searchQuery.length > 0) {
        this.pageNumber = 1;
        this.clientService.getClients(this.pageNumber, this.limit, this.searchField + "=" + this.searchQuery).subscribe(
          data => {
            this.clients = data['clients'];
            this.hasMorePages = data['has_more'];
          }
        );
      }
      else{
        this.searchQuery = '';
        this.searchField = 'Name';
        this.pageNumber = 1;
        this.getClients();
      }
    }
  }
}
