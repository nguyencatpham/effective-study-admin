//https://github.com/angular/material/blob/master/src/core/util/media.js

import {
  Injectable
} from '@angular/core';

@Injectable()
export class NoisMedia {
  private _MEDIA = {
    'xs': '(max-width: 599px)',
    'gt-xs': '(min-width: 600px)',
    'sm': '(min-width: 600px) and (max-width: 959px)',
    'gt-sm': '(min-width: 960px)',
    'md': '(min-width: 960px) and (max-width: 1279px)',
    'gt-md': '(min-width: 1280px)',
    'lg': '(min-width: 1280px) and (max-width: 1919px)',
    'gt-lg': '(min-width: 1920px)',
    'xl': '(min-width: 1920px)',
    'landscape': '(orientation: landscape)',
    'portrait': '(orientation: portrait)',
    'print': 'print'
  };
  private _MEDIA_PRIORITY = [
    'xl',
    'gt-lg',
    'lg',
    'gt-md',
    'md',
    'gt-sm',
    'sm',
    'gt-xs',
    'xs',
    'landscape',
    'portrait',
    'print'
  ];
  private _queries = {};
  private _mqls = {};
  private _results = {};
  private _normalizeCache = {};

  constructor() {

  }

  private _validate(query) {
    return this._MEDIA[query] ||
      ((query.charAt(0) !== '(') ? ('(' + query + ')') : query);
  }

  private _add(query) {
    let result = this._mqls[query];
    if ( !result ) {
      result = this._mqls[query] = window.matchMedia(query);
    }

    result.addListener(this._onQueryChange);
    return (this._results[result.media] = !!result.matches);
  }

  private _onQueryChange(query) {
    // $rootScope.$evalAsync(function() {
    //   results[query.media] = !!query.matches;
    // });
  }

  private getQuery(name) {
    return this._mqls[name];
  }

  // Improves performance dramatically
  private _getNormalizedName(attrs, attrName) {
    return this._normalizeCache[attrName] ||
      (this._normalizeCache[attrName] = attrs.$normalize(attrName));
  }

  public is(query) {
    let validated = this._queries[query];
    if (!validated) {
      validated = this._queries[query] = this._validate(query);
    }

    let result = this._results[validated];
    if (!result) {
      result = this._add(validated);
    }

    return result;
  }

  public getResponsiveAttribute(attrs, attrName) {
    for (let i = 0; i < this._MEDIA_PRIORITY.length; i++) {
      let mediaName = this._MEDIA_PRIORITY[i];
      if (!this._mqls[this._queries[mediaName]].matches) {
        continue;
      }

      let normalizedName = this._getNormalizedName(attrs, attrName + '-' + mediaName);
      if (attrs[normalizedName]) {
        return attrs[normalizedName];
      }
    }

    // fallback on unprefixed
    return attrs[this._getNormalizedName(attrs, attrName)];
  }
}
