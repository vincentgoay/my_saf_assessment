import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorResponse, ReviewResponse } from '../models';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  reviewResponse: ReviewResponse = null;

  constructor(private bookSvc: BookService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const book_id = this.activatedRoute.snapshot.params.id;
    console.log('Book Id: ', book_id);
    this.bookSvc.getReviews(book_id)
      .then(result => {
        console.log('Review response: ', result);
        this.reviewResponse = result;
      })
      .catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

}
