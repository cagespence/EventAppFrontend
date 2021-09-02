import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { File, FileEntry } from "@ionic-native/File/ngx";
import { ActionSheetController, Platform } from "@ionic/angular";
import { FilePath } from "@ionic-native/file-path/ngx";
import {
  PictureSourceType,
  Camera,
  CameraOptions
} from "@ionic-native/Camera/ngx";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-upload-img",
  templateUrl: "./upload-img.component.html",
  styleUrls: ["./upload-img.component.scss"]
})
export class UploadImgComponent implements OnInit {
  @Output() uploadedImageUrl = new EventEmitter();
  @Input() currentImage: string;

  myphoto: any;
  loading = false;
  imageUrl = "";
  showImage = false;
  uploadImageText = "upload image";

  // Context.
  stableContext = this;

  constructor(
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private changeDecectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.currentImage) {
      this.imageUrl = this.currentImage;
      this.showImage = true;
      this.uploadImageText = "upload different image";
    }
  }

  ionViewWillEnter() { }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imageData => {
      this.loading = true;
      this.getSystemURL(imageData);
    });
  }

  private getSystemURL(imageFileUri: any): void {
    this.file
      .resolveLocalFilesystemUrl(imageFileUri)
      .then(entry =>
        (entry as FileEntry).file(file => {
          this.readFile(file);
        })
      )
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
    const reader = new FileReader();
    const url = environment.backendUrl;

    reader.onloadend = () => {
      this.myphoto = new Blob([reader.result], { type: file.type });

      var headers = new HttpHeaders();
      headers.append(
        "Content-Type",
        "multipart/form-data;boundary=" + Math.random()
      );
      headers.append("Accept", "application/json");

      let formData = new FormData();
      formData.append("file", this.myphoto, this.createFileName());
      this.http
        .post<any>(`${url}/storage/uploadFile`, formData, {
          headers: headers
        })
        .subscribe(
          res => {
            console.log(res);
            console.log(this.loading);
            this.imageUrl = res.imageUrl;
            this.showImage = true;
            this.loading = false;
            console.log(this.loading);
            this.uploadImageText = "upload different image";
            this.uploadedImageUrl.emit(res.imageUrl);
            this.changeDecectorRef.detectChanges()
          },
          err => {
            console.log("error.");
            console.log(err);
          }
        );
    };
    reader.readAsArrayBuffer(file);
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}
