import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.scss'],
})

export class SearchBookComponent  implements OnInit {
  public searchResults: any;
  public searchInput: any;
  private searchTerms = new Subject<string>();
  public selectedBookId: any;
  @Output() bookSelected = new EventEmitter<string>();

  constructor(
      private http: HttpClient,
      private apiService: ApiService
  ) {
      this.searchTerms.pipe(
        debounceTime(300),  // aguarda 300ms após a última digitação antes de considerar a consulta
        distinctUntilChanged()  // evita pesquisas duplicadas
      ).subscribe(() => {
          this.search();
      });
  }

  ngOnInit() {

  }

  search() {
    this.apiService.get('books/search?search='+this.searchInput).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error('Erro:', error);
      });
  }

  onSearchInput(event: any) {
    this.searchTerms.next(this.searchInput);
  }
  handleBookSelect(book:any)
  {
    this.selectedBookId = book.id;
    this.bookSelected.emit(this.selectedBookId);
    this.searchInput   = book.name;
    this.searchResults = [];
  }
}
