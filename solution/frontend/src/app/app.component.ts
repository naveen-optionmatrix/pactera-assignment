import { Component } from '@angular/core';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pactera';
  message: String = "";
  fileUploaded: boolean = false;
  showResults: boolean = false;

  constructor(private _cs: CommonService) { }

  /**
   * This function is used to upload files to the server
   * @param files 
   */
  fileupload(event: any) {
    let files = event.target.files
    let file: File = files.item(0) as File;
    let formData = new FormData();

    formData.append("file", file);
    this._cs.post('file/upload', formData)
      .subscribe((response: any) => {
        if (response && response.type === this._cs.STR_SUCCESS) {
          setTimeout(() =>
            this.fileUploaded = true
          );

          console.log(JSON.stringify(response))
        }
      },
        err => { console.log(err) });
  }

  //this function is used to show the reports to the user
  showResultsFunc() {
    this.showResults = false;
    setTimeout(() =>
      this.showResults = true
    );
  }

}
