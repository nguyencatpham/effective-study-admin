import { Injectable } from '@angular/core';

/**
 * Configuration service for the NgbPagination component.
 * You can inject this service, typically in your root component,
 * and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
@Injectable()
export class NgbPaginationConfig {
  public disabled = false;
  public boundaryLinks = false;
  public boundaryLinksText: string;
  public directionLinks = true;
  public directionLinksText: string;
  public ellipses = true;
  public maxSize = 0;
  public pageSize = 10;
  public rotate = false;
  public size: 'sm' | 'lg';
}
