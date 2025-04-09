import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {Tab1PageModule} from "../tab1/tab1.module";
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    Tab1PageModule,
    ReactiveFormsModule
  ],
  declarations: [ProfilePage, ProfilePictureComponent]
})
export class ProfilePageModule {}
