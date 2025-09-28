import { NgModule } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatPagePage} from "./page/chat-page/chat-page.page";
import { ChatDetailPagePage } from './page/chat-detail-page/chat-detail-page.page';


@NgModule({
  declarations: [
    ChatPagePage
  ],
    imports: [
        IonicModule,
        ChatRoutingModule,
        NgForOf,
        NgIf
    ]
})
export class ChatModule { }
