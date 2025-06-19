import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as pdfjsLib from "pdfjs-dist";
import { ApiService } from "../services/api.service";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
})
export class BookDetailPage implements OnInit {

  @ViewChild('pdfCanvas', { static: false }) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;

  bookId: any;
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
      this.loadBookAndPdf();
    });
  }

  async loadBookAndPdf() {
    const loading = await this.loadingController.create({
      message: 'Carregando livro...'
    });
    await loading.present();

    try {
      const res: any = await this.apiService.get('my-books/' + this.bookId).toPromise();
      this.book = res.data;

      await this.loadPdf();

      this.renderPage(this.book.pivot.current_page);
    } catch (error) {
      console.error('Erro ao carregar livro:', error);
    } finally {
      loading.dismiss();
    }
  }

  async loadPdf() {
    try {
      const res: any = await this.apiService.getImage('my-books/' + this.bookId + '/download').toPromise();
      const blob = new Blob([res], { type: 'application/pdf' });
      const arrayBuffer = await blob.arrayBuffer();

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      this.pdfDoc = await loadingTask.promise;
    } catch (error) {
      console.error('Erro ao carregar PDF:', error);
    }
  }

  renderPage(pageNumber: number) {
    if (!this.pdfDoc) return;

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

  calculatePorcentage() {
    if (!this.book?.pivot) return 0;
    return Math.round((this.book.pivot.current_page * 100) / this.book.pages);
  }

  async updateCurrentPage(event: any) {
    const newPage = event.detail.value;
    this.book.pivot.current_page = newPage;
    this.renderPage(this.book.pivot.current_page);
    this.updatePageOnServer()
  }

  async previousPage() {
    if (this.book.pivot.current_page > 1) {
      this.book.pivot.current_page--;
      this.renderPage(this.book.pivot.current_page);
      await this.updatePageOnServer();
    }
  }

  async nextPage() {
    if (this.book.pivot.current_page < this.book.pages) {
      this.book.pivot.current_page++;
      this.renderPage(this.book.pivot.current_page);
      await this.updatePageOnServer();
    }
  }

  private async updatePageOnServer() {
    const currentPage = this.book.pivot.current_page;

    try {
      await this.apiService.put('my-books/' + this.book.id + '/change-page', { page: currentPage }).toPromise();
    } catch (error) {
      console.error('Erro ao atualizar página:', error);
    }
  }
}
