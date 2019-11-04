import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookResponse, ErrorResponse } from '../models';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  bookResponse: BookResponse = null;

  constructor(private bookSvc: BookService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    const bookId = this.activatedRoute.snapshot.params.id;
    this.bookSvc.getBook(bookId)
      .then(result => {
        this.bookResponse = result;
        console.log('BookResponse: ', this.bookResponse);
      })
      .catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

  showAllReview() {
    console.log('Show reviews');
    this.router.navigate(['book', this.bookResponse.data.book_id, 'review']);
  }

  back() {
    this.router.navigate(['/books']);
  }
}
