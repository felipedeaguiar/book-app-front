import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {book} from "ionicons/icons";
import {AlertController, LoadingController, ModalController, ToastController} from "@ionic/angular";
import {BookFormComponent} from "../book-form/book-form.component";
import {BookModalComponent} from "../book-modal/book-modal.component";
import {ApiService} from "../services/api.service";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import * as pdfjsLib from 'pdfjs-dist';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  myBooks: any[] = [];
  isActionSheetOpen = false;
  pdfUrl: string = '';
  pdfDoc: any;

  @ViewChild('pdfCanvas', { static: false }) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;

  status:  { [key: string]: string } = {
    'in_progress': 'Em progresso',
    'finished': 'Finalizado'
  }

  public searchInput: any;
  private searchTerms = new Subject<string>();

  constructor(
      private modalCtrl: ModalController,
      private http: HttpClient,
      private alertController: AlertController,
      private apiService: ApiService,
      private loadingController: LoadingController,
      private toastController: ToastController,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.loadMyBooks();

    this.searchTerms.pipe(
      debounceTime(300),  // aguarda 300ms após a última digitação antes de considerar a consulta
      distinctUntilChanged()  // evita pesquisas duplicadas
    ).subscribe(() => {
      this.loadMyBooks();
    });
  }
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BookModalComponent,
    });
    modal.onDidDismiss().then(() => {
      this.loadMyBooks();
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  private async loadMyBooks() {
    const loading = await this.loadingController.create({
      message: 'Carregando livros...', // Mensagem do loading
      spinner: 'bubbles', // Tipo de spinner
      duration: 0 // O loading vai ficar até ser fechado manualmente
    });

    await loading.present(); // Exibir o loading

    this.apiService.get('my-books?search='+this.searchInput).subscribe(
      (data) => {
        this.myBooks = data;
        loading.dismiss(); // Exibir o loading
      },
      (error) => {
        console.error('Erro:', error);
      });
  }

  shareBook(book: any) {
    // Lógica para compartilhar o livro
    console.log(`Sharing book: ${book.name}`);
  }

  selectBook() {
    const input = document.getElementById('inputFile');
    input?.click();
  }

  uploadBook(book:any, event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.apiService.post('my-books/'+book.id+'/upload', formData).subscribe(
      async (result) => {
        const toast = await this.toastController.create({
          message: 'Upload realizado com sucesso',
          duration: 1500,
        });
        await toast.present();
      },
      async (result) => {
        const toast = await this.toastController.create({
          message: result.error.errors.file[0],
          duration: 1500,
        });
        await toast.present();
      }
    );
  }

  detail(bookId: any) {
    this.router.navigate(['/book-detail/'+bookId]);
  }

  async openPdf(book: any) {
    if (!book.pivot.file) {
      const toast = await this.toastController.create({
        message: 'Nenhum arquivo adicionado, adicione no ícone de upload abaixo',
        duration: 3000,
      });
      await toast.present();
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Aguarde a abertura do arquivo...', // Mensagem do loading
      spinner: 'bubbles', // Tipo de spinner
      duration: 0 // O loading vai ficar até ser fechado manualmente
    });

    await loading.present();

    this.apiService.getImage('my-books/'+book.id+'/download').subscribe(
      (res) => {
        const blob = new Blob([res], { type: 'application/pdf' });

        blob.arrayBuffer().then((arrayBuffer) => {
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

          loadingTask.promise.then((pdf) => {
            this.pdfDoc = pdf;
            this.renderPage(book.pivot.current_page);
          });
        });
        loading.dismiss();
      },
      async (error) => {

      })
  }
  async deleteBook(book: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Deleção',
      message: `Você tem certeza que deseja deletar o livro "${book.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Deleção cancelada');
          }
        },
        {
          text: 'Deletar',
          handler: () => {
            this.apiService.delete('my-books/'+book.id).subscribe(
            (data) => {
              const index = this.myBooks.indexOf(book);
              if (index > -1) {
                this.myBooks.splice(index, 1);
              }
              console.log(`Deleted book: ${book.name}`);
            },
              (error) => {
                console.error('Erro:', error);
            });
          }
        }
      ]
    });

    await alert.present();
  }
  async updateCurrentPage(event: any, book: any) {
    book.pivot.current_page = event.detail.value;
    this.apiService.put('my-books/' + book.id + '/change-page', {'page': event.detail.value}).subscribe(
      (data) => {
        this.renderPage(book.pivot.current_page);
      },
      (error) => {
        console.error('Erro:', error);
      });
  }
  calculatePorcentage(book: any)
  {
      return Math.round((book.pivot.current_page * 100)/book.pages);
  }

  onSearchInput(event: any) {
    this.searchTerms.next(this.searchInput);
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

}
