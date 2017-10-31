import {
  Directive,
  Input,
  Optional,
  ElementRef,
  Renderer,
  EventEmitter,
  Output,
  AfterContentInit
} from '@angular/core';

import {
  NgControl
} from '@angular/forms';

/** Coerces a data-bound value (typically a string) to a boolean. */
function coerceBooleanProperty(value: any): boolean {
  return value != null && `${value}` !== 'false';
}

@Directive({
  selector: 'input[nois-input], textarea[nois-input]',
  host: {
    '[id]': 'id',
    '[placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '(blur)': '_onBlur()',
    '(focus)': '_onFocus()',
    '(input)': '_onInput()',
  }
})
export class NoisInputDirective implements AfterContentInit {
  public focused = false;

  private _inputId: string = Math.ceil(Math.random() * 1000000000).toString();

  /** Whether the element is disabled. */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _disabled = false;

  /** Unique id of the element. */
  @Input()
  get id() {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  private _id: string;

  /** Placeholder attribute of the element. */
  @Input()
  get placeholder() { return this._placeholder; }
  set placeholder(value: string) {
    if (this._placeholder != value) {
      this._placeholder = value;
      this._placeholderChange.emit(this._placeholder);
    }
  }
  private _placeholder = '';

  /** Whether the element is required. */
  @Input()
  get required() {
    return this._required;
  }

  set required(value: any) {
    this._required = coerceBooleanProperty(value);
  }

  private _required = false;

  /** Input type of the element. */
  @Input()
  get type() {
    return this._type;
  }

  set type(value: string) {
    this._type = value || 'text';
    // this._validateType();
  }

  private _type = 'text';

  /** The element's value. */
  private value: any;

  /**
   * Emits an event when the placeholder changes so that the `nois-input-container` can re-validate.
   */
  @Output() _placeholderChange = new EventEmitter<string>();

  private get _uid() {
    return this._cachedUid = this._cachedUid || `nois-input-${this._inputId}`;
  }

  private _cachedUid: string;

  constructor(private _elementRef: ElementRef,
              private _renderer: Renderer,
              @Optional() public _ngControl: NgControl) {
    // Force setter to be called in case id was not specified.
    this.id = this.id;

    if (this._ngControl && this._ngControl.valueChanges) {
      this._ngControl.valueChanges.subscribe((value) => {
        this.value = value;
      });
    }
  }

  public ngAfterContentInit() {
    this.value = this._elementRef.nativeElement.value;
  }

  /** Focuses the input element. */
  public focus() {
    this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus');
  }

  public _onFocus() {
    this.focused = true;
  }

  public _onBlur() {
    this.focused = false;
  }

  public _onInput() {
    this.value = this._elementRef.nativeElement.value;
  }
}
