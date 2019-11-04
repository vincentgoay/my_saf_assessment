import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { ActivatedRoute } from '@angular/router';
import { BookResponse, ErrorResponse } from '../models';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  bookResponse = null;

  constructor(private bookSvc: BookService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const bookId = this.activatedRoute.snapshot.params.id;
    this.bookSvc.getBook(bookId)
      .then(result => {
        this.bookResponse = result;
      })
      .catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }
}
