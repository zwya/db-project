import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { UpdaterequestService } from '../updaterequest.service';

@Component({
  selector: 'app-client-update-admin',
  templateUrl: './client-update-admin.component.html',
  styleUrls: ['./client-update-admin.component.css']
})
export class ClientUpdateAdminComponent implements OnInit {
  private newRequests: any[];
  private createForm: FormGroup;
  private hoverIndex: number;
  private requestsQueried: boolean;
  private requestSelected: boolean;
  private selectedRequest: any;
  private hasMorePages: boolean;
  private currentRequestStatus;

  constructor(private updateRequestService: UpdaterequestService) { }

  ngOnInit() {
    this.newRequests = null;
    this.requestsQueried = false;
    this.requestSelected = false;
    this.pageNumber = 1;
    this.limit = 10;
    this.currentRequestStatus = 'New';
    this.createForm = new FormGroup({
      fieldtoupdate: new FormControl(''),
      name: new FormControl(''),
      oldvalue: new FormControl(''),
      organization: new FormControl(''),
      newvalue: new FormControl(''),
      subcategory2: new FormControl('')
    });

    this.updateRequestService.getRequests(this.pageNumber, this.limit, this.currentRequestStatus).subscribe(
      data => {
        this.newRequests = data['data'];
        this.requestsQueried = true;
        this.hasMorePages = data['has_more']
      }
    );
  }

  setIndex(index){
    this.hoverIndex = index;
  }

  clearIndex() {
    this.hoverIndex = null;
  }

  goToDetails() {
    this.selectedRequest = this.newRequests[this.hoverIndex];
    this.requestSelected = true;
    this.createForm.setValue({
      fieldtoupdate: this.selectedRequest['fieldtoupdate'],
      name: this.selectedRequest['requestedby']['username'],
      oldvalue: this.selectedRequest['oldvalue'],
      organization: this.selectedRequest['client']['organization'],
      newvalue: this.selectedRequest['newvalue'],
      subcategory2: this.selectedRequest['client']['subcategory']['1']
    });
  }

  nextPage() {
    this.updateRequestService.getRequests(this.pageNumber, this.limit, this.currentRequestStatus).subscribe(
      data => {
        this.pageNumber++;
        this.newRequests = data['data'];
        this.hasMorePages = data['has_more']
      }
    );
  }

  previousPage() {
    this.updateRequestService.getRequests(this.pageNumber, this.limit, this.currentRequestStatus).subscribe(
      data => {
        this.pageNumber--;
        this.newRequests = data['data'];
        this.hasMorePages = data['has_more']
      }
    );
  }

  back() {
    this.requestSelected = false;
  }

  approve() {
    this.updateRequestService.approveRequest(this.selectedRequest['_id']).subscribe(
      data => {
        console.log(data);
        this.newRequests.splice(this.hoverIndex, 1);
        this.back();
      }
    );
  }

  reject() {
    this.updateRequestService.rejectRequest(this.selectedRequest['_id']).subscribe(
      data => {
        console.log(data);
        this.newRequests.splice(this.hoverIndex, 1);
        this.back();
      }
    );
  }

  getRejectedRequests() {
    this.currentRequestStatus = 'rejected';
    this.updateRequestService.getRequests(this.pageNumber, this.limit, this.currentRequestStatus).subscribe(
      data => {
        this.newRequests = data['data'];
        this.hasMorePages = data['has_more']
      }
    );
  }

  getApprovedRequests() {
    this.currentRequestStatus = 'approved';
    this.updateRequestService.getRequests(this.pageNumber, this.limit, this.currentRequestStatus).subscribe(
      data => {
        this.newRequests = data['data'];
        this.hasMorePages = data['has_more']
      }
    );
  }

  getAllRequests() {
    this.currentRequestStatus = '';
    this.updateRequestService.getRequests(this.pageNumber, this.limit, this.currentRequestStatus).subscribe(
      data => {
        this.newRequests = data['data'];
        this.hasMorePages = data['has_more']
      }
    );
  }

  getNewRequests() {
    this.currentRequestStatus = 'New';
    this.updateRequestService.getRequests(this.pageNumber, this.limit, this.currentRequestStatus).subscribe(
      data => {
        this.newRequests = data['data'];
        this.hasMorePages = data['has_more']
      }
    );
  }
}
