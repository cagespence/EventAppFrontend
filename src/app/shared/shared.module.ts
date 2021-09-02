import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { IonicModule } from "@ionic/angular";
import { TagsComponent } from "./tags/tags.component";
import { AddTagsComponent } from "./add-tags/add-tags.component";
import { UploadImgComponent } from "./upload-img/upload-img.component";
import { Camera } from "@ionic-native/Camera/ngx";
import { File } from "@ionic-native/File/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [
    HeaderComponent,
    AddTagsComponent,
    UploadImgComponent,
    TagsComponent
  ],
  providers: [Camera, File, FilePath],
  exports: [
    HeaderComponent,
    TagsComponent,
    AddTagsComponent,
    UploadImgComponent
  ]
})
export class SharedModule {}
