import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatPagePage} from "./page/chat-page/chat-page.page";

const routes: Routes = [
  { path: '', component: ChatPagePage },
  {
    path: ':id',
    loadChildren: () => import('./page/chat-detail-page/chat-detail-page.module').then( m => m.ChatDetailPagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {

 }
