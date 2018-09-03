import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "/api/updatereq";

@Injectable({
  providedIn: 'root'
})
export class UpdaterequestService {

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

  addRequest(clientid: String, fieldsToUpdate: String[], newValues: String[]) {
    var body = {};
    body['clientid'] = clientid;
    body['userid'] = localStorage.getItem('userId');
    body['fieldstoupdate'] = fieldsToUpdate;
    body['values'] = newValues;
    body = JSON.stringify(body);
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.post(apiUrl + token, body, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getRequests(pageNumber: number, limit: number, status: String) {
    const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
    const param = (status != '')? '&requeststatus=' + status : '';
    console.log(apiUrl + "?page=" + pageNumber + "&limit=" + limit + token + param);
    return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit + token + param, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getRejectedRequests(pageNumber: number, limit: number) {
    const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
    return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit + token + '&requeststatus=rejected', httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getApprovedRequests(pageNumber: number, limit: number) {
    const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
    return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit + token + '&requeststatus=approved', httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAllRequests(pageNumber: number, limit: number) {
    const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
    return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  approveRequest(id: String) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.get(apiUrl + '/approve/' + id + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  rejectRequest(id: String) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.get(apiUrl + '/reject/' + id + token, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
