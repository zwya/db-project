import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Client } from './client.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "/api/client";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients: Client[];

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

    getClients(pageNumber: number, limit: number, query?: string): Observable<any> {
      if(pageNumber) {
        const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
        if(query) {
          return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit + "&" + query + token, httpOptions).pipe(
            map(this.extractClientData),
            catchError(this.handleError)
          );
        }
        return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit + token, httpOptions).pipe(
          map(this.extractClientData),
          catchError(this.handleError)
        );
      }
    }

    getClientsMultipleQueries(pageNumber: number, limit: number, query: any): Observable<any> {
      if(pageNumber) {
        const token = localStorage.getItem('token') ? '&token=' + localStorage.getItem('token') : '';
        var querystring = '';
        for(var key in query) {
          querystring += "&" + key + "=" + query[key];
        }
        return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit + querystring + token, httpOptions).pipe(
          map(this.extractClientData),
          catchError(this.handleError)
        );
      }
    }

    getClient(id: string) {
      const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
      return this.http.get(apiUrl + "/" + id + token, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    private extractClientData(res: Response) {
      var body = res;
      let frontEndClient: Client[] = [];
      for(let client of body['data']) {
        frontEndClient.push(new Client(client.title, client.name, client.job_title, client.organization, client.email, client.category, client.core, client.address, client.subcategory, client.mobile, client.phone, client.fax, client._id));
      }
      this.clients = frontEndClient;
      return {clients: frontEndClient, has_more: body['has_more']} || { };
    }

    addClient(client: Client) {
      const body = JSON.stringify(client);
      const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
      return this.http.post(apiUrl + token, body, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    deleteClient(id: string) {
      const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
      return this.http.delete(apiUrl + "/" + id + token).pipe(
        catchError(this.handleError)
      );
    }

    updateClient(client: Client) {
      const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
      return this.http.patch(apiUrl + "/" + client.id + token, JSON.stringify(client) ,httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    downloadCSV(client: Client) {
      const body = JSON.stringify(client);
      const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
      return this.http.post(apiUrl +'/csv' + token, body, httpOptions).pipe(
        catchError(this.handleError)
      );
    }
}
