import {
  Component,
  HostListener,
  OnDestroy
} from '@angular/core';

import {
  ImgZoomClickService
} from './img-zoom-click.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'img-zoom-click',
  template: `
    <div class="zoomPhoto" *ngIf="imageUrl" (click)="unZoomPhoto()">
      <img [src]="imageUrl" [ngStyle]="{'max-height': '90%'}" height="auto" width="auto"/>
    </div>
  `,
  styles: [`
    .zoomPhoto {
      background: rgba(0, 0, 0, 0.8);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9998;
      -webkit-transform: translateZ(10px);
    }

    .zoomPhoto img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 9999;
      -webkit-transform: translateZ(10px);
    }
  `]
})
export class ImgZoomClickComponent implements OnDestroy {
  public subscription: Subscription;
  public imageUrl: string;

  constructor(private _imgZoomClickService: ImgZoomClickService) {
    this.subscription = _imgZoomClickService.onImgClick$.subscribe(
      (url) => {
        this.imageUrl = url;
      });
  }

  public unZoomPhoto() {
    this.imageUrl = '';
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.unZoomPhoto();
    }
  }

  public ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
