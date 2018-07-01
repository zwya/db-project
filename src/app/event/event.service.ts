import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, RequestOptions } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'reponseType': 'Blob'})
};
const apiUrl = "/api/client/csv";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        console.log(error.error);
      }
      // return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later.');
    }

    downloadFile(category, subcategory, core) {
      const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
      return this.http.get(apiUrl + "?category=" + category + "&subcategory=" + subcategory + "&core=" + core + token).pipe(
        catchError(this.handleError)
      );
    }
}
