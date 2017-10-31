import {
  Directive,
  Input,
  ElementRef,
  OnInit
} from '@angular/core';

import {
  UserContext
} from '../../services/user-context';

@Directive({
  selector: '[permission]'
})
export class PermissionDirective implements OnInit {
  @Input() public permission: number[];

  constructor(private _elementRef: ElementRef,
              private userContext: UserContext) {
  }

  public ngOnInit() {
    let currentUser = this.userContext.currentUser;
    if (!this.permission) {
      return true;
    }
    let havePermission = false;
    currentUser.roles.forEach(role => {
      this.permission.forEach(per => {
        if(role.id === per) {
          havePermission = true;
        }
      });
    });

    if(!havePermission) {
      let el: HTMLElement = this._elementRef.nativeElement;
      el.parentNode.removeChild(el);
    }
  }
}
