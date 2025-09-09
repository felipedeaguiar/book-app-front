import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPagePageRoutingModule } from './chat-page-routing.module';

import { ChatPagePage } from './chat-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPagePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class ChatPagePageModule {}
