import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';

import { EventService } from '../event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  csvForm: FormGroup;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.csvForm = new FormGroup({
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
      core: new FormControl(false)
    });
  }

  downloadFile() {
    this.eventService.downloadFile(this.csvForm.value.category, this.csvForm.value.subcategory, this.csvForm.value.core)
    .subscribe(
      //data => FileSaver.saveAs(data.file, "output.csv")
      data => {
        var blob = new Blob([data.file], {type: "text/csv;charset=utf-8}")
        FileSaver.saveAs(blob, "output.csv")
      }
    );
  }
}
