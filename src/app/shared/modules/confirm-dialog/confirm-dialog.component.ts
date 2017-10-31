import {
  Component,
  Input,
} from '@angular/core';

import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.template.html',
})
export class ConfirmDialogComponent {
  @Input()
  public message: string;

  @Input()
  public title: string;
  constructor(public activeModal: NgbActiveModal) {}
}
