/* */ 
"format cjs";
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { isPresent, isBlank, RegExpWrapper, CONST_EXPR } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * This class represents a parsed URL
 */
export class Url {
    constructor(path, child = null, auxiliary = CONST_EXPR([]), params = null) {
        this.path = path;
        this.child = child;
        this.auxiliary = auxiliary;
        this.params = params;
    }
    toString() {
        return this.path + this._matrixParamsToString() + this._auxToString() + this._childString();
    }
    segmentToString() { return this.path + this._matrixParamsToString(); }
    /** @internal */
    _auxToString() {
        return this.auxiliary.length > 0 ?
            ('(' + this.auxiliary.map(sibling => sibling.toString()).join('//') + ')') :
            '';
    }
    _matrixParamsToString() {
        if (isBlank(this.params)) {
            return '';
        }
        return ';' + serializeParams(this.params).join(';');
    }
    /** @internal */
    _childString() { return isPresent(this.child) ? ('/' + this.child.toString()) : ''; }
}
export class RootUrl extends Url {
    constructor(path, child = null, auxiliary = CONST_EXPR([]), params = null) {
        super(path, child, auxiliary, params);
    }
    toString() {
        return this.path + this._auxToString() + this._childString() + this._queryParamsToString();
    }
    segmentToString() { return this.path + this._queryParamsToString(); }
    _queryParamsToString() {
        if (isBlank(this.params)) {
            return '';
        }
        return '?' + serializeParams(this.params).join('&');
    }
}
export function pathSegmentsToUrl(pathSegments) {
    var url = new Url(pathSegments[pathSegments.length - 1]);
    for (var i = pathSegments.length - 2; i >= 0; i -= 1) {
        url = new Url(pathSegments[i], url);
    }
    return url;
}
var SEGMENT_RE = RegExpWrapper.create('^[^\\/\\(\\)\\?;=&#]+');
function matchUrlSegment(str) {
    var match = RegExpWrapper.firstMatch(SEGMENT_RE, str);
    return isPresent(match) ? match[0] : '';
}
export class UrlParser {
    peekStartsWith(str) { return this._remaining.startsWith(str); }
    capture(str) {
        if (!this._remaining.startsWith(str)) {
            throw new BaseException(`Expected "${str}".`);
        }
        this._remaining = this._remaining.substring(str.length);
    }
    parse(url) {
        this._remaining = url;
        if (url == '' || url == '/') {
            return new Url('');
        }
        return this.parseRoot();
    }
    // segment + (aux segments) + (query params)
    parseRoot() {
        if (this.peekStartsWith('/')) {
            this.capture('/');
        }
        var path = matchUrlSegment(this._remaining);
        this.capture(path);
        var aux = [];
        if (this.peekStartsWith('(')) {
            aux = this.parseAuxiliaryRoutes();
        }
        if (this.peekStartsWith(';')) {
            // TODO: should these params just be dropped?
            this.parseMatrixParams();
        }
        var child = null;
        if (this.peekStartsWith('/') && !this.peekStartsWith('//')) {
            this.capture('/');
            child = this.parseSegment();
        }
        var queryParams = null;
        if (this.peekStartsWith('?')) {
            queryParams = this.parseQueryParams();
        }
        return new RootUrl(path, child, aux, queryParams);
    }
    // segment + (matrix params) + (aux segments)
    parseSegment() {
        if (this._remaining.length == 0) {
            return null;
        }
        if (this.peekStartsWith('/')) {
            this.capture('/');
        }
        var path = matchUrlSegment(this._remaining);
        this.capture(path);
        var matrixParams = null;
        if (this.peekStartsWith(';')) {
            matrixParams = this.parseMatrixParams();
        }
        var aux = [];
        if (this.peekStartsWith('(')) {
            aux = this.parseAuxiliaryRoutes();
        }
        var child = null;
        if (this.peekStartsWith('/') && !this.peekStartsWith('//')) {
            this.capture('/');
            child = this.parseSegment();
        }
        return new Url(path, child, aux, matrixParams);
    }
    parseQueryParams() {
        var params = {};
        this.capture('?');
        this.parseParam(params);
        while (this._remaining.length > 0 && this.peekStartsWith('&')) {
            this.capture('&');
            this.parseParam(params);
        }
        return params;
    }
    parseMatrixParams() {
        var params = {};
        while (this._remaining.length > 0 && this.peekStartsWith(';')) {
            this.capture(';');
            this.parseParam(params);
        }
        return params;
    }
    parseParam(params) {
        var key = matchUrlSegment(this._remaining);
        if (isBlank(key)) {
            return;
        }
        this.capture(key);
        var value = true;
        if (this.peekStartsWith('=')) {
            this.capture('=');
            var valueMatch = matchUrlSegment(this._remaining);
            if (isPresent(valueMatch)) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[key] = value;
    }
    parseAuxiliaryRoutes() {
        var routes = [];
        this.capture('(');
        while (!this.peekStartsWith(')') && this._remaining.length > 0) {
            routes.push(this.parseSegment());
            if (this.peekStartsWith('//')) {
                this.capture('//');
            }
        }
        this.capture(')');
        return routes;
    }
}
export var parser = new UrlParser();
export function serializeParams(paramMap) {
    var params = [];
    if (isPresent(paramMap)) {
        StringMapWrapper.forEach(paramMap, (value, key) => {
            if (value == true) {
                params.push(key);
            }
            else {
                params.push(key + '=' + value);
            }
        });
    }
    return params;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9yb3V0ZXIvdXJsX3BhcnNlci50cyJdLCJuYW1lcyI6WyJVcmwiLCJVcmwuY29uc3RydWN0b3IiLCJVcmwudG9TdHJpbmciLCJVcmwuc2VnbWVudFRvU3RyaW5nIiwiVXJsLl9hdXhUb1N0cmluZyIsIlVybC5fbWF0cml4UGFyYW1zVG9TdHJpbmciLCJVcmwuX2NoaWxkU3RyaW5nIiwiUm9vdFVybCIsIlJvb3RVcmwuY29uc3RydWN0b3IiLCJSb290VXJsLnRvU3RyaW5nIiwiUm9vdFVybC5zZWdtZW50VG9TdHJpbmciLCJSb290VXJsLl9xdWVyeVBhcmFtc1RvU3RyaW5nIiwicGF0aFNlZ21lbnRzVG9VcmwiLCJtYXRjaFVybFNlZ21lbnQiLCJVcmxQYXJzZXIiLCJVcmxQYXJzZXIucGVla1N0YXJ0c1dpdGgiLCJVcmxQYXJzZXIuY2FwdHVyZSIsIlVybFBhcnNlci5wYXJzZSIsIlVybFBhcnNlci5wYXJzZVJvb3QiLCJVcmxQYXJzZXIucGFyc2VTZWdtZW50IiwiVXJsUGFyc2VyLnBhcnNlUXVlcnlQYXJhbXMiLCJVcmxQYXJzZXIucGFyc2VNYXRyaXhQYXJhbXMiLCJVcmxQYXJzZXIucGFyc2VQYXJhbSIsIlVybFBhcnNlci5wYXJzZUF1eGlsaWFyeVJvdXRlcyIsInNlcmlhbGl6ZVBhcmFtcyJdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztPQUN4RCxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBQyxNQUFNLDBCQUEwQjtPQUMvRSxFQUFDLGFBQWEsRUFBbUIsTUFBTSxnQ0FBZ0M7QUFFOUU7O0dBRUc7QUFDSDtJQUNFQSxZQUFtQkEsSUFBWUEsRUFBU0EsS0FBS0EsR0FBUUEsSUFBSUEsRUFDdENBLFNBQVNBLEdBQVVBLFVBQVVBLENBQUNBLEVBQUVBLENBQUNBLEVBQ2pDQSxNQUFNQSxH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WUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDakNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM5QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDckJBLENBQUNBO1FBQ0hBLENBQUNBO1FBQ0RBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWxCQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7QUFDSFQsQ0FBQ0E7QUFFRCxXQUFXLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBRXBDLGdDQUFnQyxRQUE4QjtJQUM1RFUsSUFBSUEsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0E7SUFDaEJBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3hCQSxnQkFBZ0JBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBO1lBQzVDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ25CQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDTkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDakNBLENBQUNBO1FBQ0hBLENBQUNBLENBQUNBLENBQUNBO0lBQ0xBLENBQUNBO0lBQ0RBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO0FBQ2hCQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rLCBSZWdFeHBXcmFwcGVyLCBDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIHBhcnNlZCBVUkxcbiAqL1xuZXhwb3J0IGNsYXNzIFVybCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXRoOiBzdHJpbmcsIHB1YmxpYyBjaGlsZDogVXJsID0gbnVsbCxcbiAgICAgICAgICAgICAgcHVibGljIGF1eGlsaWFyeTogVXJsW10gPSBDT05TVF9FWFBSKFtdKSxcbiAgICAgICAgICAgICAgcHVibGljIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0gPSBudWxsKSB7fVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGF0aCArIHRoaXMuX21hdHJpeFBhcmFtc1RvU3RyaW5nKCkgKyB0aGlzLl9hdXhUb1N0cmluZygpICsgdGhpcy5fY2hpbGRTdHJpbmcoKTtcbiAgfVxuXG4gIHNlZ21lbnRUb1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXRoICsgdGhpcy5fbWF0cml4UGFyYW1zVG9TdHJpbmcoKTsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2F1eFRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXV4aWxpYXJ5Lmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgKCcoJyArIHRoaXMuYXV4aWxpYXJ5Lm1hcChzaWJsaW5nID0+IHNpYmxpbmcudG9TdHJpbmcoKSkuam9pbignLy8nKSArICcpJykgOlxuICAgICAgICAgICAgICAgJyc7XG4gIH1cblxuICBwcml2YXRlIF9tYXRyaXhQYXJhbXNUb1N0cmluZygpOiBzdHJpbmcge1xuICAgIGlmIChpc0JsYW5rKHRoaXMucGFyYW1zKSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiAnOycgKyBzZXJpYWxpemVQYXJhbXModGhpcy5wYXJhbXMpLmpvaW4oJzsnKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NoaWxkU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5jaGlsZCkgPyAoJy8nICsgdGhpcy5jaGlsZC50b1N0cmluZygpKSA6ICcnOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290VXJsIGV4dGVuZHMgVXJsIHtcbiAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBjaGlsZDogVXJsID0gbnVsbCwgYXV4aWxpYXJ5OiBVcmxbXSA9IENPTlNUX0VYUFIoW10pLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0gbnVsbCkge1xuICAgIHN1cGVyKHBhdGgsIGNoaWxkLCBhdXhpbGlhcnksIHBhcmFtcyk7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhdGggKyB0aGlzLl9hdXhUb1N0cmluZygpICsgdGhpcy5fY2hpbGRTdHJpbmcoKSArIHRoaXMuX3F1ZXJ5UGFyYW1zVG9TdHJpbmcoKTtcbiAgfVxuXG4gIHNlZ21lbnRUb1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXRoICsgdGhpcy5fcXVlcnlQYXJhbXNUb1N0cmluZygpOyB9XG5cbiAgcHJpdmF0ZSBfcXVlcnlQYXJhbXNUb1N0cmluZygpOiBzdHJpbmcge1xuICAgIGlmIChpc0JsYW5rKHRoaXMucGFyYW1zKSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiAnPycgKyBzZXJpYWxpemVQYXJhbXModGhpcy5wYXJhbXMpLmpvaW4oJyYnKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0aFNlZ21lbnRzVG9VcmwocGF0aFNlZ21lbnRzOiBzdHJpbmdbXSk6IFVybCB7XG4gIHZhciB1cmwgPSBuZXcgVXJsKHBhdGhTZWdtZW50c1twYXRoU2VnbWVudHMubGVuZ3RoIC0gMV0pO1xuICBmb3IgKHZhciBpID0gcGF0aFNlZ21lbnRzLmxlbmd0aCAtIDI7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgdXJsID0gbmV3IFVybChwYXRoU2VnbWVudHNbaV0sIHVybCk7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIFNFR01FTlRfUkUgPSBSZWdFeHBXcmFwcGVyLmNyZWF0ZSgnXlteXFxcXC9cXFxcKFxcXFwpXFxcXD87PSYjXSsnKTtcbmZ1bmN0aW9uIG1hdGNoVXJsU2VnbWVudChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHZhciBtYXRjaCA9IFJlZ0V4cFdyYXBwZXIuZmlyc3RNYXRjaChTRUdNRU5UX1JFLCBzdHIpO1xuICByZXR1cm4gaXNQcmVzZW50KG1hdGNoKSA/IG1hdGNoWzBdIDogJyc7XG59XG5cbmV4cG9ydCBjbGFzcyBVcmxQYXJzZXIge1xuICBwcml2YXRlIF9yZW1haW5pbmc6IHN0cmluZztcblxuICBwZWVrU3RhcnRzV2l0aChzdHI6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVtYWluaW5nLnN0YXJ0c1dpdGgoc3RyKTsgfVxuXG4gIGNhcHR1cmUoc3RyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3JlbWFpbmluZy5zdGFydHNXaXRoKHN0cikpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBFeHBlY3RlZCBcIiR7c3RyfVwiLmApO1xuICAgIH1cbiAgICB0aGlzLl9yZW1haW5pbmcgPSB0aGlzLl9yZW1haW5pbmcuc3Vic3RyaW5nKHN0ci5sZW5ndGgpO1xuICB9XG5cbiAgcGFyc2UodXJsOiBzdHJpbmcpOiBVcmwge1xuICAgIHRoaXMuX3JlbWFpbmluZyA9IHVybDtcbiAgICBpZiAodXJsID09ICcnIHx8IHVybCA9PSAnLycpIHtcbiAgICAgIHJldHVybiBuZXcgVXJsKCcnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFyc2VSb290KCk7XG4gIH1cblxuICAvLyBzZWdtZW50ICsgKGF1eCBzZWdtZW50cykgKyAocXVlcnkgcGFyYW1zKVxuICBwYXJzZVJvb3QoKTogVXJsIHtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJy8nKTtcbiAgICB9XG4gICAgdmFyIHBhdGggPSBtYXRjaFVybFNlZ21lbnQodGhpcy5fcmVtYWluaW5nKTtcbiAgICB0aGlzLmNhcHR1cmUocGF0aCk7XG5cbiAgICB2YXIgYXV4ID0gW107XG4gICAgaWYgKHRoaXMucGVla1N0YXJ0c1dpdGgoJygnKSkge1xuICAgICAgYXV4ID0gdGhpcy5wYXJzZUF1eGlsaWFyeVJvdXRlcygpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnOycpKSB7XG4gICAgICAvLyBUT0RPOiBzaG91bGQgdGhlc2UgcGFyYW1zIGp1c3QgYmUgZHJvcHBlZD9cbiAgICAgIHRoaXMucGFyc2VNYXRyaXhQYXJhbXMoKTtcbiAgICB9XG4gICAgdmFyIGNoaWxkID0gbnVsbDtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnLycpICYmICF0aGlzLnBlZWtTdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJy8nKTtcbiAgICAgIGNoaWxkID0gdGhpcy5wYXJzZVNlZ21lbnQoKTtcbiAgICB9XG4gICAgdmFyIHF1ZXJ5UGFyYW1zID0gbnVsbDtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnPycpKSB7XG4gICAgICBxdWVyeVBhcmFtcyA9IHRoaXMucGFyc2VRdWVyeVBhcmFtcygpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJvb3RVcmwocGF0aCwgY2hpbGQsIGF1eCwgcXVlcnlQYXJhbXMpO1xuICB9XG5cbiAgLy8gc2VnbWVudCArIChtYXRyaXggcGFyYW1zKSArIChhdXggc2VnbWVudHMpXG4gIHBhcnNlU2VnbWVudCgpOiBVcmwge1xuICAgIGlmICh0aGlzLl9yZW1haW5pbmcubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJy8nKTtcbiAgICB9XG4gICAgdmFyIHBhdGggPSBtYXRjaFVybFNlZ21lbnQodGhpcy5fcmVtYWluaW5nKTtcbiAgICB0aGlzLmNhcHR1cmUocGF0aCk7XG5cbiAgICB2YXIgbWF0cml4UGFyYW1zID0gbnVsbDtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnOycpKSB7XG4gICAgICBtYXRyaXhQYXJhbXMgPSB0aGlzLnBhcnNlTWF0cml4UGFyYW1zKCk7XG4gICAgfVxuICAgIHZhciBhdXggPSBbXTtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnKCcpKSB7XG4gICAgICBhdXggPSB0aGlzLnBhcnNlQXV4aWxpYXJ5Um91dGVzKCk7XG4gICAgfVxuICAgIHZhciBjaGlsZCA9IG51bGw7XG4gICAgaWYgKHRoaXMucGVla1N0YXJ0c1dpdGgoJy8nKSAmJiAhdGhpcy5wZWVrU3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgdGhpcy5jYXB0dXJlKCcvJyk7XG4gICAgICBjaGlsZCA9IHRoaXMucGFyc2VTZWdtZW50KCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVXJsKHBhdGgsIGNoaWxkLCBhdXgsIG1hdHJpeFBhcmFtcyk7XG4gIH1cblxuICBwYXJzZVF1ZXJ5UGFyYW1zKCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICB2YXIgcGFyYW1zID0ge307XG4gICAgdGhpcy5jYXB0dXJlKCc/Jyk7XG4gICAgdGhpcy5wYXJzZVBhcmFtKHBhcmFtcyk7XG4gICAgd2hpbGUgKHRoaXMuX3JlbWFpbmluZy5sZW5ndGggPiAwICYmIHRoaXMucGVla1N0YXJ0c1dpdGgoJyYnKSkge1xuICAgICAgdGhpcy5jYXB0dXJlKCcmJyk7XG4gICAgICB0aGlzLnBhcnNlUGFyYW0ocGFyYW1zKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxuXG4gIHBhcnNlTWF0cml4UGFyYW1zKCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICB2YXIgcGFyYW1zID0ge307XG4gICAgd2hpbGUgKHRoaXMuX3JlbWFpbmluZy5sZW5ndGggPiAwICYmIHRoaXMucGVla1N0YXJ0c1dpdGgoJzsnKSkge1xuICAgICAgdGhpcy5jYXB0dXJlKCc7Jyk7XG4gICAgICB0aGlzLnBhcnNlUGFyYW0ocGFyYW1zKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxuXG4gIHBhcnNlUGFyYW0ocGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHZvaWQge1xuICAgIHZhciBrZXkgPSBtYXRjaFVybFNlZ21lbnQodGhpcy5fcmVtYWluaW5nKTtcbiAgICBpZiAoaXNCbGFuayhrZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY2FwdHVyZShrZXkpO1xuICAgIHZhciB2YWx1ZTogYW55ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnPScpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJz0nKTtcbiAgICAgIHZhciB2YWx1ZU1hdGNoID0gbWF0Y2hVcmxTZWdtZW50KHRoaXMuX3JlbWFpbmluZyk7XG4gICAgICBpZiAoaXNQcmVzZW50KHZhbHVlTWF0Y2gpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVNYXRjaDtcbiAgICAgICAgdGhpcy5jYXB0dXJlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJhbXNba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcGFyc2VBdXhpbGlhcnlSb3V0ZXMoKTogVXJsW10ge1xuICAgIHZhciByb3V0ZXMgPSBbXTtcbiAgICB0aGlzLmNhcHR1cmUoJygnKTtcblxuICAgIHdoaWxlICghdGhpcy5wZWVrU3RhcnRzV2l0aCgnKScpICYmIHRoaXMuX3JlbWFpbmluZy5sZW5ndGggPiAwKSB7XG4gICAgICByb3V0ZXMucHVzaCh0aGlzLnBhcnNlU2VnbWVudCgpKTtcbiAgICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgIHRoaXMuY2FwdHVyZSgnLy8nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jYXB0dXJlKCcpJyk7XG5cbiAgICByZXR1cm4gcm91dGVzO1xuICB9XG59XG5cbmV4cG9ydCB2YXIgcGFyc2VyID0gbmV3IFVybFBhcnNlcigpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplUGFyYW1zKHBhcmFtTWFwOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHN0cmluZ1tdIHtcbiAgdmFyIHBhcmFtcyA9IFtdO1xuICBpZiAoaXNQcmVzZW50KHBhcmFtTWFwKSkge1xuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChwYXJhbU1hcCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGlmICh2YWx1ZSA9PSB0cnVlKSB7XG4gICAgICAgIHBhcmFtcy5wdXNoKGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMucHVzaChrZXkgKyAnPScgKyB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHBhcmFtcztcbn1cbiJdfQ==