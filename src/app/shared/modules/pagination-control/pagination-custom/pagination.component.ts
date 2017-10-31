import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { NgbPaginationConfig } from './pagination-config';

/**
 * A directive that will take care of visualising
 * a pagination bar and enable / disable buttons correctly!
 */
@Component({
  selector: 'pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'pagination.template.html',
})
export class PaginationComponent implements OnChanges {
  public pageCount = 0;
  public pages: number[] = [];

  /**
   * Whether to disable buttons from user input
   */
  @Input() public disabled: boolean;

  /**
   *  Whether to show the "First" and "Last" page links
   */
  @Input() public boundaryLinks: boolean;

  /**
   *  Whether to show the "Next" and "Previous" page links
   */
  @Input() public directionLinks: boolean;

  /**
   *  Whether to show ellipsis symbols and first/last page numbers when maxSize > number of pages
   */
  @Input() public ellipses: boolean;

  /**
   *  Whether to rotate pages when maxSize > number of pages.
   *  Current page will be in the middle
   */
  @Input() public rotate: boolean;

  /**
   *  Number of items in collection.
   */
  @Input() public collectionSize: number;

  /**
   *  Maximum number of pages to display.
   */
  @Input() public maxSize: number;

  /**
   *  Current page.
   */
  @Input() public page = 0;

  /**
   *  Number of items per page.
   */
  @Input() public pageSize: number;

  /**
   *  An event fired when the page is changed.
   *  Event's payload equals to the newly selected page.
   */
  @Output() public pageChange = new EventEmitter<number>(true);

  /**
   * Pagination display size: small or large
   */
  @Input() public size: 'sm' | 'lg';

  /**
   * Custom text
   */
  @Input() public boundaryLinksFirst: string;
  @Input() public boundaryLinksLast: string;
  @Input() public directionLinksPrev: string;
  @Input() public directionLinksNext: string;
  @Input() public autoHide: boolean;

  constructor(config: NgbPaginationConfig) {
    this.disabled = config.disabled;
    this.boundaryLinks = config.boundaryLinks;
    this.directionLinks = config.directionLinks;
    this.ellipses = config.ellipses;
    this.maxSize = config.maxSize;
    this.pageSize = config.pageSize;
    this.rotate = config.rotate;
    this.size = config.size;
  }

  public toInteger(value: string): number {
    return parseInt(`${value}`, 10);
  }

  public isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

  public getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }

  public hasPrevious(): boolean { return this.page > 1; }

  public hasNext(): boolean { return this.page < this.pageCount; }

  public selectPage(pageNumber: number): void { this._updatePages(pageNumber); }

  public ngOnChanges(changes: SimpleChanges): void { this._updatePages(this.page); }

  /**
   * @internal
   */
  public isEllipsis(pageNumber: number): boolean { return pageNumber === -1; }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private _applyEllipses(start: number, end: number) {
    if (this.ellipses) {
      if (start > 0) {
        if (start > 1) {
          this.pages.unshift(-1);
        }
        this.pages.unshift(1);
      }
      if (end < this.pageCount) {
        if (end < (this.pageCount - 1)) {
          this.pages.push(-1);
        }
        this.pages.push(this.pageCount);
      }
    }
  }

  /**
   * Rotates page numbers based on maxSize items visible.
   * Currently selected page stays in the middle:
   *
   * Ex. for selected page = 6:
   * [5,*6*,7] for maxSize = 3
   * [4,5,*6*,7] for maxSize = 4
   */
  private _applyRotation(): [number, number] {
    let start = 0;
    let end = this.pageCount;
    let leftOffset = Math.floor(this.maxSize / 2);
    let rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this.page <= leftOffset) {
      // very beginning, no rotation -> [0..maxSize]
      end = this.maxSize;
    } else if (this.pageCount - this.page < leftOffset) {
      // very end, no rotation -> [len-maxSize..len]
      start = this.pageCount - this.maxSize;
    } else {
      // rotate
      start = this.page - leftOffset - 1;
      end = this.page + rightOffset;
    }

    return [start, end];
  }

  /**
   * Paginates page numbers based on maxSize items per page
   */
  private _applyPagination(): [number, number] {
    let page = Math.ceil(this.page / this.maxSize) - 1;
    let start = page * this.maxSize;
    let end = start + this.maxSize;

    return [start, end];
  }

  private _setPageInRange(newPageNo: number) {
    const prevPageNo = this.page;
    this.page = this.getValueInRange(newPageNo, this.pageCount, 1);

    if (this.page !== prevPageNo) {
      this.pageChange.emit(this.page);
    }
  }

  private _updatePages(newPage: number) {
    this.pageCount = Math.ceil(this.collectionSize / this.pageSize);

    if (!this.isNumber(this.pageCount)) {
      this.pageCount = 0;
    }

    // fill-in model needed to render pages
    this.pages.length = 0;
    for (let i = 1; i <= this.pageCount; i++) {
      this.pages.push(i);
    }

    // set page within 1..max range
    this._setPageInRange(newPage);

    // apply maxSize if necessary
    if (this.maxSize > 0 && this.pageCount > this.maxSize) {
      let start = 0;
      let end = this.pageCount;

      // either paginating or rotating page numbers
      if (this.rotate) {
        [start, end] = this._applyRotation();
      } else {
        [start, end] = this._applyPagination();
      }

      this.pages = this.pages.slice(start, end);

      // adding ellipses
      this._applyEllipses(start, end);
    }
  }
}
