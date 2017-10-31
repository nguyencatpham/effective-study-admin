import {
  Directive,
  EventEmitter,
  Output,
  HostListener,
  ElementRef
} from '@angular/core';

@Directive({
  selector: "a,p,div,span,section,article,h1,h2,h3,h4,h5,h6,b,strong,i,body,button,input,dt,dl,ul,li,ol,form,img,label,legend,fieldset,nav,aside,header,footer,select,option,table,tr,td,thead,tbody,tfooter,textarea",
  exportAs: 'common-element'
})
export class CommonElement {
  /**
   * Mouse enter
   */
  @Output()
  public onMouseEnter = new EventEmitter<string>();

  @HostListener('mouseenter', ['$event.target'])
  public _onMouseEnter($target) {
    this.onMouseEnter.emit('mouseentered');
  }

  /**
   * Mouse leave
   */
  @Output()
  public onMouseLeave = new EventEmitter<string>();

  @HostListener('mouseleave', ['$event.target'])
  public _onMouseLeave($target) {
    this.onMouseLeave.emit('mouseleft');
  }

  /**
   * Get element height includes content
   */

  protected getHeight() {
    // Clone element and it's children
    let cloned = this.el.nativeElement.cloneNode(true);
    cloned.style.height = 'auto';
    cloned.style.display = 'block';
    // Append cloned element to parent
    this.el.nativeElement.parentNode.appendChild(cloned);
    // Get element height
    let elHeight = cloned.offsetHeight;
    // Destroy cloned element
    this.el.nativeElement.parentNode.removeChild(cloned);

    return elHeight;
  }

  constructor(public el: ElementRef) {

  }
}
