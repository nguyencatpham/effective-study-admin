import {
  Component,
  ViewEncapsulation,
  HostListener,
  Input,
  AfterViewInit,
  ContentChild,
  ViewChild
} from '@angular/core';

import {
  QuickViewContentComponent
} from '../../../../../shared/modules/quick-view';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'quickview',  // <quickview></quickview>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './quickview.template.html',
  styleUrls: [
    './quickview.style.scss'
  ]
})
export class QuickViewComponent implements AfterViewInit {
  public config: any = {
    // wheelSpeed: 1              // Scroll speed for the mousewheel event (Default: 1).
    // wheelPropagation: false        // Propagate wheel events at the end (Default: false).
    // swipePropagation: true        // Propagate swipe events at the end (Default: true).
    // minScrollbarLength      // Minimum size for the scrollbar (Default: null).
    // maxScrollbarLength      // Maximum size for the scrollbar (Default: null).
    // useBothWheelAxes        // Always use the both wheel axes (Default: false).
    // suppressScrollX         // Disable X axis in all situations (Default: false).
    // suppressScrollY         // Disable Y axis ni all situations (Default: false).
    // scrollXMarginOffset     // Offset before enabling the X scroller (Default: 0).
    // scrollYMarginOffset     // Offset before enabling the Y scroller (Default: 0).
    // stopPropagationOnClick  // Stop the propagation of click event (Default: true).
  };

  @ViewChild('quickView') // => find #quickView
  public quickView: QuickViewContentComponent;
  @ViewChild('quickViewChat') // => find #quickViewChat
  public quickViewChat: QuickViewContentComponent;

  // constructor() {
  // }

   public ngAfterViewInit() {
     // after view init
   }

  public go() {
    this.quickView.slide();
  }

  public back() {
    this.quickView.back();
  }

  public chatGo() {
    this.quickViewChat.slide();
  }

  public chatBack() {
    this.quickViewChat.back();
  }
}
