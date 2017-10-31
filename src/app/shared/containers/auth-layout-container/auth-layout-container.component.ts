import {
  Component,
  ViewEncapsulation
} from '@angular/core';

@Component({
    // The selector is what angular internally uses
    // for `document.querySelectorAll(selector)` in our index.html
    // where, in this case, selector is the string 'home'
    selector: 'auth-layout-container',  // <auth-layout-container></auth-layout-container>
    // Our list of styles in our component. We may add more to compose many styles together
    encapsulation: ViewEncapsulation.None,
    // Every Angular template is first compiled by the browser before Angular runs it's compiler
    templateUrl: './auth-layout-container.template.html',
    styleUrls: [
      './auth-layout-container.style.scss'
    ]
})
export class AuthLayoutComponent {
}
