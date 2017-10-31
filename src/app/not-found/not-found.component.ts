import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  Router
} from '@angular/router';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'not-found',  // <not-found></not-found>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'not-found.template.html'
})
export class NotFoundComponent {

  // TypeScript public modifiers
  constructor(private _router: Router) {
  }
}
