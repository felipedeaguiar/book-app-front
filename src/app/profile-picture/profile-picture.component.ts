import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent  implements OnInit {

  @Input() picture: string | ArrayBuffer| null = null;

  constructor(
    protected apiService: ApiService,
    protected toastController: ToastController
  ) { }

  ngOnInit() {}

  carregarImagem(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: any) => {
      this.picture = reader.result;
    };

    this.sendApi(file)
  }

  alterarImagem() {
    const input = document.getElementById('pictureFile');
    input?.click();
  }

  sendApi(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    this.apiService.post('user/profile/picture', formData).subscribe(
      async (result) => {
        const toast = await this.toastController.create({
          message: result.message,
          duration: 3000,
        });
        await toast.present();
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: error.error.message,
          duration: 3000,
        });
        await toast.present();
      }
    );
  }
}
