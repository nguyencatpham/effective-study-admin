import {
  Injectable,
  EventEmitter
} from '@angular/core';

import NProgress from 'nprogress';

@Injectable()
export class ProgressService {
  private _isStarted: boolean = false;
  private _counter: number = 0;
  private _doneTimeout;

  public onStart = new EventEmitter<boolean>();
  public onDone = new EventEmitter<boolean>();

  constructor() {

  }

  public start() {
    this._isStarted = true;
    this._counter++;
    NProgress.start();
    if(this._doneTimeout){
      clearTimeout(this._doneTimeout);
    }
    this.onStart.emit(true);
  }

  public done() {
    this._counter--;
    if (this._counter <= 0) {
      this._counter = 0;
      this._isStarted = false;
      this._doneTimeout = setTimeout(() => {
        NProgress.done()
      }, 400);
      this.onDone.emit(true);
    }
  }
}
