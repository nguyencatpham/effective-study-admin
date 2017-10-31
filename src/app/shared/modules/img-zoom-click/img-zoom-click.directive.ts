import {
  Directive,
  ElementRef,
  HostListener
} from '@angular/core';

import {
  ImgZoomClickService
} from './img-zoom-click.service';

@Directive({
  selector: '[imgZoomClick]'
})

export class ImgZoomClickDirective {
  constructor(private _el: ElementRef,
              private _imgZoomClickService: ImgZoomClickService) {
  }

  @HostListener('click', ['$event.target'])
  public onClick(ev: Event) {
    this._imgZoomClickService.clickToZoom(ev['src']);
  }
}
