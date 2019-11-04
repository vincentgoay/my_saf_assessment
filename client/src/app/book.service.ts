import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse } from './models';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4
    let params = new HttpParams()
      .set('terms', searchCriteria.terms)

    if (searchCriteria.limit) {
      params = params.append('size', searchCriteria.limit.toString());
    }
    if (searchCriteria.offset) {
      params = params.append('start', searchCriteria.offset.toString());
    }

    const headers = new HttpHeaders()
      .set('Accept', 'application/json');

    const url = 'api/search'
    console.log('API Request: ', url);

    return this.http.get<BooksResponse>(url, { headers, params}).toPromise();
  }

  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5
    return (null);
  }
}
