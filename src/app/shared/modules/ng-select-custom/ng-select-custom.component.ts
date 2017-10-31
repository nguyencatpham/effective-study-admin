import {
  Component,
  ViewEncapsulation,
  Input,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Interfaces
import {
  SelectComponent
} from 'ng2-select';

@Component({
  selector: 'ng-select-custom',
  templateUrl: 'ng-select-custom.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    'ng-select-custom.style.scss'
  ]
})
export class NgSelectCustomComponent implements OnInit,
                                                AfterViewInit,
                                                OnChanges {
  @ViewChild('ngSelect')
  public ngSelect: SelectComponent;

  @Input()
  public data = [];
  @Input()
  public asyncData = [];
  @Input()
  public multiple = false;
  @Input()
  public active;
  @Input()
  public activeProp = 'id';
  @Input()
  public visibleText = 'value';
  @Input()
  public allowClear = true;
  @Input()
  public focused = false;
  @Input()
  public placeholder = 'Select item...';
  @Input()
  public allowNewValue = false;
  @Input()
  public disabled = false;
  @Output()
  public value = new EventEmitter<any>();

  public isClicked;
  public currentValueActived;
  public activeItem = [];

  public ngOnInit(): void {
    this.updateData(this.data);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.asyncData
      && changes.asyncData.currentValue
      && changes.asyncData.currentValue.length) {
      this.updateData(changes.asyncData.currentValue);
    } else if (changes.active && changes.active.currentValue) {
      this.updateData(this.data);
    }
  }

  public ngAfterViewInit(): void {
    if (this.focused) {
      this.focusedMe();
    }
    this.ngSelect['open'] = () => this.open();
    this.ngSelect['mainClick'] = (e) => this.mainClick(e);
    this.ngSelect['clickedOutside'] = () => this.clickOutside();
  }

  public focusedMe() {
    setTimeout(() => {
      this.ngSelect['matchClick'](null);
    });
  }

  public updateData(data) {
    this.data = data || [];
    this.data.forEach((item) => {
      item['text'] = item[this.visibleText];
    });
    if (!!this.active) {
      if (this.active[this.visibleText]) {
        this.activeItem = [this.active[this.visibleText]];
      } else {
        let currentItemActive = this.data
          .find((item) => item[this.activeProp] === this.active);
        if (currentItemActive) {
          this.activeItem = [currentItemActive[this.visibleText]];
        }
      }
    }
  }

  public activeValue(data) {
    data.forEach((item) => {
      if (!item['text']) {
        item['text'] = item[this.visibleText];
      }
    });
    this.activeItem = data;
  }

  public onSelected(value) {
    this.isClicked = false;
    // ---------Storage current actived item---------
    this.currentValueActived = this.ngSelect['active'][0];
    if (!this.multiple) {
      this.activeValue([value]);
    } else {
      this.activeItem.push(value);
      this.activeValue(this.activeItem);
    }
    // Emit fully property value
    let currentValue = this.data.filter((item) => item[this.visibleText] === value.text);
    this.value.emit(currentValue[0]);
  }

  public onRemoved(value?) {
    let itemRemove = this.activeItem.findIndex((item) => item.id === value.id);
    this.activeItem.splice(itemRemove, 1);
    this.ngSelect.placeholder = this.placeholder;
    this.value.emit(this.activeItem.length ? this.activeItem : '');
  }

  public reset() {
    this.ngSelect['active'] = [];
    this.activeItem = [];
  }

  private open() {
    this.isClicked = true;
    if (!this.multiple) {
      // -----------------------------------------------------------
      // ---------Storage current actived item---------
      this.currentValueActived = this.ngSelect['active'][0];
      // --------------Set placeholder is actived item--------------
      if (this.ngSelect['active'].length) {
        this.ngSelect.placeholder = this.ngSelect['active'][0].text;

        // hight light active select and keep text
        setTimeout(() => {
          let placeholder: string = this.ngSelect.placeholder;
          let selectElement: Element = this.ngSelect.element.nativeElement;
          selectElement.querySelector('.ui-select-search')['value'] = placeholder;
          selectElement.querySelector('li[role="menuitem"] .ui-select-choices-row').classList.remove('active');
          [].forEach.call(selectElement.querySelectorAll('.ui-select-choices-row'), (item: Element) => {
            if (item.querySelector('a div').textContent === placeholder) {
              item.className += ' active';
            }
          });
        });
      }
      // -----Remove current actived item to visible placeholder----
      this.ngSelect['active'] = [];
      // -----------------------------------------------------------
    }
    // Origin code
    this.ngSelect.options = this.ngSelect.itemObjects
      .filter((option: any) => (this.ngSelect.multiple === false ||
      this.ngSelect.multiple === true && !this.ngSelect['active']
        .find((o: any) => option.text === o.text)));

    if (this.ngSelect.options.length > 0) {
      this.ngSelect['behavior'].first();
    }
    this.ngSelect['optionsOpened'] = true;
    // ---------------
  }

  private activeNewValue(newValue: string) {
    // If new value duplicate value in list
    let duplValueIndex = this.data
      .findIndex((att) => att.text.toLowerCase() === newValue.toLowerCase());
    if (duplValueIndex > -1) {
      if (this.data[duplValueIndex].isNewValue) {
        this.data.splice(duplValueIndex, 1);
      } else {
        // Active value if input text duplicate with value in data
        this.activeItem = [this.data[duplValueIndex]];
        this.ngSelect['inputValue'] = '';
        this.ngSelect['inputMode'] = false;
        this.ngSelect['optionsOpened'] = false;
        return;
      }
    }
    // Add new item to value list
    this.data.push({
      id: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
      text: newValue,
      isNewValue: true
    });
    // Active new value
    this.activeItem = [{
      text: newValue,
      isNewValue: true
    }];
    // Select new value and validate submit
    this.ngSelect['inputValue'] = '';
    this.ngSelect['clickedOutside']();
  }

  private mainClick(event: any): void {
    // Origin code
    if (this.ngSelect['inputMode'] === true || this.ngSelect['_disabled'] === true) {
      // My code
      if (!this.multiple) {
        if (this.allowNewValue && this.ngSelect['inputValue'] && event.keyCode === 13) {
          this.activeNewValue(this.ngSelect['inputValue']);
          this.value.emit(this.activeItem[0]);
        }
      }
      // ---------------
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      this.ngSelect.inputEvent(event);
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      this.ngSelect.inputEvent(event, true);
      return;
    }
    // My code: Focus open dropdown
    if (event.keyCode === 9) {
      event.preventDefault();
      this.ngSelect['matchClick'](null);
      return;
    }
    // --------------------------
    if (event.keyCode === 13 ||
      event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }
    this.ngSelect['inputMode'] = true;
    let value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105
        ? event.keyCode - 48 : event.keyCode).toLowerCase();
    this.ngSelect['focusToInput'](value);
    this.open();
    let target = event.target || event.srcElement;
    target.value = value;
    this.ngSelect.inputEvent(event);
    // ---------------
  }

  private reactiveValue(activeItem) {
    // Reactive actived item
    if (activeItem) {
      this.ngSelect['active'] = [activeItem];
    }
  }

  private clickOutside() {
    if (this.isClicked) {
      this.ngSelect.placeholder = this.placeholder;
      this.isClicked = false;
      if (!this.multiple) {
        if (this.allowNewValue) {
          // Active new value when click outside
          if (this.ngSelect['inputValue']) {
            this.activeNewValue(this.ngSelect['inputValue']);
            this.value.emit(this.activeItem[0]);
          }
        }
        this.reactiveValue(this.activeItem[0] ? this.activeItem[0] : this.currentValueActived);
      }
      // Default code of method
      this.ngSelect['inputMode'] = false;
      this.ngSelect['optionsOpened'] = false;
    }
  }
}
