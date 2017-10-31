import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  Observable,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'input-debounce',
  templateUrl: 'input-debounce.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    'input-debounce.style.scss',
  ],
})

export class InputDebounceComponent implements AfterViewInit {
  @ViewChild('searchInput')
  public searchInput: ElementRef;

  @Input()
  public autoClear: boolean;

  @Input()
  public placeholder: string;

  @Input()
  public delay: number;

  @Output()
  public value = new EventEmitter<any>();

  @Input()
  public inputValue: string;

  @Input()
  public showSuggestion: boolean;

  @Input()
  public loadSuggestion: (_: string) => Observable<any>;

  public suggestResult: any;
  public suggestResultEncode: any;
  public isOpen: boolean;
  public isSubmitted: boolean;
  private _suggestListSubscription: Subscription;

  constructor() {
    this.autoClear = false;
    this.isOpen = false;
    this.isSubmitted = false;
    this.suggestResult = {};
    this.showSuggestion = false;
  }

  public ngAfterViewInit(): void {
    let eventStream = Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
      .map((event: any) => {
        return {
          event,
          value: this.inputValue,
        };
      })
      .distinctUntilChanged();

    if (this.delay) {
      eventStream = eventStream.debounceTime(this.delay);
    }

    eventStream.subscribe((e: any) => {
      if (e.event.keyCode === 13) {
        this.submit(e.value);
      } else if (this.showSuggestion) {
        /**
         * First, We Need To Assign isSubmitted To False
         * Second, We Close Current Suggestion In Case Old Suggestion Still Show
         * @type {boolean}
         */
        this.isSubmitted = false;
        this.closeSuggestion();
        if (this.inputValue) {
          /**
           * Check If We Have A Remain Subscription Still Wait For Api
           * We Need To Close It Before Recall API Again
           */
          if (this._suggestListSubscription
            && !this._suggestListSubscription.closed) {
            this._suggestListSubscription.unsubscribe();
          }
          this._suggestListSubscription = this.loadSuggestion(this.inputValue)
            .subscribe((resp: any[]) => {
                /**
                 * Reload Suggestion Data And Bind It Into View
                 */
                this.reloadSuggestion(resp);
              },
              (error) => {
                // catch error here
              },
              () => {
                /**
                 * If Input Search Is Submitted, We Dont Show Suggestion
                 */
                if (!this.isSubmitted) {
                  this.openSuggestion();
                }
              });
        }
      }
    });

    this.clearInputValue();
  }

  /**
   * Input Search Submit Event
   * @param inputValue
   */
  public submit(inputValue) {
    this.isSubmitted = true;
    this.value.emit(inputValue);
    setTimeout(() => {
      this.closeSuggestion();
      this.clearInputValue();
    });
  }

  /**
   * Click Suggest Value Event
   * @param keyword
   */
  public onClickSuggestValue(keyword: string) {
    this.inputValue = keyword;
    this.submit(this.inputValue);
  }

  /**
   * Click Outside Suggest Form Event
   * @param e
   */
  public clickedOutside(e) {
    this.closeSuggestion();
  }

  /**
   * Reload Suggestion Data
   * @param obj
   */
  public reloadSuggestion(obj: any) {
    this.suggestResult = obj;
    /**
     * We Need To Create A Regex With Input Value And Loop Over Each Property In Suggest Result
     * If Anything Match This Suggest, We Format It With A Span Tag With Class 'matchcharacter'
     * To HighLight Match
     * @type {RegExp}
     */
    let regex = new RegExp(`(${this.inputValue})`, 'ig');
    this.suggestResultEncode = JSON.parse(JSON.stringify(this.suggestResult));
    for (let matchField of Object.keys(this.suggestResultEncode)) {
      let matchFieldArray: any[] = this.suggestResultEncode[matchField];
      for (let i = 0; i < matchFieldArray.length; ++i) {
        matchFieldArray[i] = matchFieldArray[i]
          .replace(regex, `<span class='matchcharacter'>$1</span>`);
      }
    }
    this.openSuggestion();
  }

  /**
   * Open Suggestion Box
   */
  public openSuggestion() {
    this.isOpen = true;
  }

  /**
   * Close Suggestion Box
   */
  public closeSuggestion() {
    this.isOpen = false;
  }

  /**
   * Clear Input Value
   */
  public clearInputValue() {
    if (this.autoClear) {
      this.inputValue = '';
    }
  }

  /**
   * Create Search Keyword As Pair Value
   * @param key: key String
   * @param value: value String
   * @returns {string}
   */
  public getKeyword(key: string, value: string) {
    return `${key ? key + ':' : ''}${value}`;
  }
}
