import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent  implements OnInit {

  @Input() picture: string | ArrayBuffer| null = null;

  constructor(protected apiService: ApiService) { }

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
    const input = document.getElementById('inputFile');
    input?.click();
  }

  sendApi(file: any) {  
    const formData = new FormData();
    formData.append('file', file);

    this.apiService.post('user/profile/picture', formData).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
