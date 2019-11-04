import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BooksResponse } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  limit = 10;
  offset = 0;
  terms = '';

  books: BooksResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
    , private bookSvc: BookService) { }

  ngOnInit() {
    const state = window.history.state;
    if (!state['terms'])
      return this.router.navigate(['/']);

    this.terms = state.terms;
    this.limit = state.limit || 10;

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit
    }
    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        this.books = result;
        this.updateFlag();
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

  next() {
    //TODO - for Task 4
    const total = this.books.total;

    const searchCriteria: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
      offset: this.books.offset + this.books.limit
    }

    this.fetchBooks(searchCriteria);
  }

  previous() {
    //TODO - for Task 4
    const total = this.books.total;

    const searchCriteria: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
      offset: this.books.offset - this.books.limit
    }

    this.fetchBooks(searchCriteria);
  }

  fetchBooks(searchCriteria: SearchCriteria) {
    this.bookSvc.getBooks(searchCriteria)
      .then(result => {
        this.books = result;
        this.updateFlag();
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

  isNextDisabled(): boolean {
    return (this.books.offset || 0 + this.books.limit) < this.books.total;
  }

  isPrevDisabled(): boolean {
    return (this.books.offset || 0 + this.books.limit) < this.books.total;
  }

  updateFlag() {
    console.log('Update flag');
    // this.isNextDisabled = true;//(this.books.offset || 0 + this.books.limit) < this.books.total;
    // this.isPrevDisabled =  (this.books.offset || 0 + this.books.limit) < this.books.total;
  }

  bookDetails(book_id: string) {
    //TODO
    console.info('Book id: ', book_id);
  }

  back() {
    this.router.navigate(['/']);
  }
}
