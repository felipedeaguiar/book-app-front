import { IonicModule } from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import {SearchBookComponent} from "../search-book/search-book.component";
import {BookModalComponent} from "../book-modal/book-modal.component";
import {BookFormComponent} from "../book-form/book-form.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [Tab1Page, SearchBookComponent, BookModalComponent, BookFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line

})
export class Tab1PageModule {}
