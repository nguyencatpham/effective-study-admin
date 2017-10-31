import {
  Component,
  ViewEncapsulation,
  ElementRef,
  ContentChild,
  Input
} from '@angular/core';

import {
  QuickViewLeftContentDirective
} from './quick-view-left-content.directive';

import {
  QuickViewRightContentDirective
} from './quick-view-right-content.directive';

@Component({
  selector: 'quick-view',
  templateUrl: 'quick-view.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    'quick-view.style.scss'
  ],
  exportAs: 'quickView' // => #QuickView="quickView"
})
export class QuickViewContentComponent {
  @ContentChild(QuickViewLeftContentDirective)
  public leftContentTpl: QuickViewLeftContentDirective;

  @ContentChild(QuickViewRightContentDirective)
  public rightContentTpl: QuickViewRightContentDirective;

  @Input()
  public parrallax: boolean = false;

  private element: any;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  public slide() {
    this.element.firstChild.classList.add('push');
  }

  public back() {
    this.element.firstChild.classList.remove('push');
  }
}
