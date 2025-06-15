import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as pdfjsLib from "pdfjs-dist";
import {ApiService} from "../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
})
export class BookDetailPage implements OnInit {

  @ViewChild('pdfCanvas', { static: false }) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;

  private bookId: any;
  pdfUrl: string = '';
  pdfDoc: any;
  book: any;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.bookId = paramsId['bookId'];
    });
    this.loadBook();
    this.downloadBook();
  }

  async loadBook() {
    const loading = await this.loadingController.create({
      message: 'Loading book...'
    });
    loading.present();


    this.apiService.get('my-books/' + this.bookId).subscribe(
      (res) => {
        this.book = res.data;
        this.downloadBook();  
        loading.dismiss();
      },
      async (error) => {
        // console.error(error);
        // const toast = await this.loadingController.create({
        //   message: 'Error loading book.',
        //   duration: 1500
        // });
        // await toast.present();
        // loading.dismiss();
      }
    );
  }

  downloadBook() {
    this.apiService.getImage('my-books/'+this.bookId+'/download').subscribe(
      (res) => {
        const blob = new Blob([res], { type: 'application/pdf' });

        blob.arrayBuffer().then((arrayBuffer) => {
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

          loadingTask.promise.then((pdf) => {
            this.pdfDoc = pdf;
            this.renderPage(this.book.pivot.current_page);
          });
        });
      },
      async (error) => {}
    )
  }

  renderPage(pageNumber: number) {
    this.pdfDoc.getPage(pageNumber).then((page: any) => {
      const canvas = this.pdfCanvasRef.nativeElement;
      const context = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context!,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }

  calculatePorcentage()
  {
      return Math.round((this.book.pivot.current_page * 100)/this.book.pages);
  }

  async updateCurrentPage(event: any) {
    this.book.pivot.current_page = event.detail.value;
    this.apiService.put('my-books/' + this.book.id + '/change-page', {'page': event.detail.value}).subscribe(
      (data) => {
        this.renderPage(this.book.pivot.current_page);
      },
      (error) => {
        console.error('Erro:', error);
      });
  }

  previousPage() {    
    if (this.book.pivot.current_page > 1) {
      this.book.pivot.current_page--;
      this.apiService.put('my-books/' + this.book.id + '/change-page', {'page': this.book.pivot.current_page}).subscribe(
        (data) => {
          this.renderPage(this.book.pivot.current_page);
        },
        (error) => {
          console.error('Erro:', error);
        });
    }
  }

  nextPage() {
    if (this.book.pivot.current_page < this.book.pages) {
      this.book.pivot.current_page++;
      this.apiService.put('my-books/' + this.book.id + '/change-page', {'page': this.book.pivot.current_page}).subscribe(
        (data) => {
          this.renderPage(this.book.pivot.current_page);
        },
        (error) => {
          console.error('Erro:', error);
        });
    }
  }

}
