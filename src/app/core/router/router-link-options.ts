import {
  Directive,
  Input,
  AfterViewInit,
  HostListener,
  ElementRef
} from '@angular/core';

import {
  RouterService
} from './router.service';

interface RouterLinkOptionsInterface {
  enableBackView: boolean;
}

@Directive({
  selector: '[routerLink][routerLinkOptions]'
})
export class RouterLinkOptions implements AfterViewInit {
  @Input('routerLinkOptions')
  public options: RouterLinkOptionsInterface;

  @HostListener('click')
  public onClick() {
    // Make sure user has to click to the link with different with current page
    this._routerService.set({
      enableBackView: this._el.nativeElement.attributes["routerLink"].value !== window.location.hash.substr(1),
      pageYOffset: window.pageYOffset
    });
  }

  constructor(private _routerService: RouterService,
              private _el: ElementRef) {

  }

  ngAfterViewInit() {
    console.log(this.options);
  }
}
