import {
  Directive,
  TemplateRef
} from '@angular/core';

/**
 * This directive should be used to wrap tab titles
 * that need to contain HTML markup or other directives.
 */
@Directive({selector: 'ng-template[quickViewLeft]'})
export class QuickViewLeftContentDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
