import {
  Directive,
  TemplateRef
} from '@angular/core';

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({selector: 'ng-template[quickViewRight]'})
export class QuickViewRightContentDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
