/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo-02.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../dist/element/graphic.js":
/*!**********************************!*\
  !*** ../dist/element/graphic.js ***!
  \**********************************/
/*! exports provided: Graphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Graphic", function() { return Graphic; });
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");

class Graphic {
    constructor(geometry, symbol) {
        this.visible = true;
        this._geometry = geometry;
        this._symbol = symbol;
    }
    get bound() {
        return this._geometry ? this._geometry.bound : null;
    }
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"](), extent = projection.bound) {
        if (this.visible)
            this._geometry.draw(ctx, projection, extent, this._symbol);
    }
}


/***/ }),

/***/ "../dist/geometry/geometry.js":
/*!************************************!*\
  !*** ../dist/geometry/geometry.js ***!
  \************************************/
/*! exports provided: Geometry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return Geometry; });
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");


class Geometry {
    get bound() {
        return this._bound;
    }
    project(projection) { }
    ;
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimplePointSymbol"]()) { }
    ;
}


/***/ }),

/***/ "../dist/geometry/point.js":
/*!*********************************!*\
  !*** ../dist/geometry/point.js ***!
  \*********************************/
/*! exports provided: Point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




//点
class Point extends _geometry__WEBPACK_IMPORTED_MODULE_0__["Geometry"] {
    constructor(lng, lat) {
        super();
        this._lng = lng;
        this._lat = lat;
    }
    ;
    //need interface to separate dependence
    /* addTo(map) {
        this._projection = map.projection;
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        map.addGeometry(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.beginPath(); //Start path
        const matrix = (ctx as any).getTransform();
        //keep radius size
        ctx.setTransform(1,0,0,1,0,0);
        ctx.arc((matrix.a * this._x + matrix.e), (matrix.d * this._y + matrix.f), Point.RADIUS, 0, Math.PI * 2, true);

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }; */
    project(projection) {
        this._projection = projection;
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance
        this._bound = new _util_bound__WEBPACK_IMPORTED_MODULE_1__["Bound"](this._x, this._y, this._x, this._y);
        this._projected = true;
    }
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimplePointSymbol"]()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._projected)
                this.project(projection);
            if (!extent.intersect(this._bound))
                return;
            ctx.save();
            if (symbol instanceof _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimplePointSymbol"]) {
                ctx.strokeStyle = symbol.strokeStyle;
                ctx.fillStyle = symbol.fillStyle;
                ctx.lineWidth = symbol.lineWidth;
                ctx.beginPath(); //Start path
                const matrix = ctx.getTransform();
                //keep size
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.arc((matrix.a * this._x + matrix.e), (matrix.d * this._y + matrix.f), symbol.radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.stroke();
            }
            else if (symbol instanceof _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimpleMarkerSymbol"]) {
                const marker = symbol;
                if (!marker.loaded)
                    yield marker.load();
                if (marker.icon) {
                    const matrix = ctx.getTransform();
                    //keep size
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.drawImage(marker.icon, (matrix.a * this._x + matrix.e) - marker.offsetX, (matrix.d * this._y + matrix.f) - marker.offsetY, marker.width, marker.height);
                }
            }
            ctx.restore();
        });
    }
    ;
}
Point.RADIUS = 10; //10px


/***/ }),

/***/ "../dist/geometry/polygon.js":
/*!***********************************!*\
  !*** ../dist/geometry/polygon.js ***!
  \***********************************/
/*! exports provided: Polygon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Polygon", function() { return Polygon; });
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");




//面
class Polygon extends _geometry__WEBPACK_IMPORTED_MODULE_0__["Geometry"] {
    constructor(lnglats) {
        super();
        this._lnglats = lnglats;
    }
    ;
    /* addTo(map) {
        this._projection = map.projection;
        this._coordinates = this._lnglats.map((ring:any) => ring.map((point: any) => this._projection.project(point)));

        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach( ring => {
            ring.forEach(point =>{
                xmin = Math.min(xmin, point[0]);
                ymin = Math.min(ymin, point[1]);
                xmax = Math.max(xmax, point[0]);
                ymax = Math.max(ymax, point[1]);
            })
        });
        this._bound = new Bound(xmin, ymin, xmax, ymax);
        map.addGeometry(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const matrix = (ctx as any).getTransform();
        ctx.setTransform(1,0,0,1,0,0);
        this._coordinates.forEach( ring => {
            ring.forEach( (point,index) => {
                let x = point[0], y = point[1];
                if (index === 0){
                    ctx.moveTo((matrix.a * x + matrix.e), (matrix.d * y + matrix.f));
                } else {
                    ctx.lineTo((matrix.a * x + matrix.e), (matrix.d * y + matrix.f));
                }
            });
        });
        ctx.closePath();
        ctx.fill("evenodd");
        ctx.stroke();
        ctx.restore();
    } */
    project(projection) {
        this._projection = projection;
        this._coordinates = this._lnglats.map((ring) => ring.map((point) => this._projection.project(point)));
        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach(ring => {
            ring.forEach(point => {
                xmin = Math.min(xmin, point[0]);
                ymin = Math.min(ymin, point[1]);
                xmax = Math.max(xmax, point[0]);
                ymax = Math.max(ymax, point[1]);
            });
        });
        this._bound = new _util_bound__WEBPACK_IMPORTED_MODULE_1__["Bound"](xmin, ymin, xmax, ymax);
    }
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimpleFillSymbol"]()) {
        if (!this._projected)
            this.project(projection);
        if (!extent.intersect(this._bound))
            return;
        ctx.save();
        ctx.strokeStyle = symbol.strokeStyle;
        ctx.fillStyle = symbol.fillStyle;
        ctx.lineWidth = symbol.lineWidth;
        const matrix = ctx.getTransform();
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        ctx.beginPath();
        this._coordinates.forEach(ring => {
            ring.forEach((point, index) => {
                const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
                if (index === 0) {
                    ctx.moveTo(screenX, screenY);
                }
                else {
                    ctx.lineTo(screenX, screenY);
                }
            });
        });
        ctx.closePath();
        ctx.fill("evenodd");
        ctx.stroke();
        ctx.restore();
    }
}


/***/ }),

/***/ "../dist/geometry/polyline.js":
/*!************************************!*\
  !*** ../dist/geometry/polyline.js ***!
  \************************************/
/*! exports provided: Polyline */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Polyline", function() { return Polyline; });
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");




//线
class Polyline extends _geometry__WEBPACK_IMPORTED_MODULE_0__["Geometry"] {
    constructor(lnglats) {
        super();
        this._lnglats = lnglats;
    }
    ;
    /* addTo(map) {
        this._projection = map.projection;
        this._coordinates = this._lnglats.map( (point: any) => this._projection.project(point));

        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach( point => {
            xmin = Math.min(xmin, point[0]);
            ymin = Math.min(ymin, point[1]);
            xmax = Math.max(xmax, point[0]);
            ymax = Math.max(ymax, point[1]);
        });
        this._bound = new Bound(xmin, ymin, xmax, ymax);

        map.addGeometry(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const matrix = (ctx as any).getTransform();
        //keep lineWidth
        ctx.setTransform(1,0,0,1,0,0);
        this._coordinates.forEach( (point: any,index) => {
            if (index === 0){
                ctx.moveTo((matrix.a * point[0] + matrix.e), (matrix.d * point[1] + matrix.f));
            } else {
                ctx.lineTo((matrix.a * point[0] + matrix.e), (matrix.d * point[1] + matrix.f));
            }
        });
        ctx.stroke();
        ctx.restore();
    } */
    project(projection) {
        this._projection = projection;
        this._coordinates = this._lnglats.map((point) => this._projection.project(point));
        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach(point => {
            xmin = Math.min(xmin, point[0]);
            ymin = Math.min(ymin, point[1]);
            xmax = Math.max(xmax, point[0]);
            ymax = Math.max(ymax, point[1]);
        });
        this._bound = new _util_bound__WEBPACK_IMPORTED_MODULE_1__["Bound"](xmin, ymin, xmax, ymax);
    }
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimpleLineSymbol"]()) {
        if (!this._projected)
            this.project(projection);
        if (!extent.intersect(this._bound))
            return;
        ctx.save();
        ctx.strokeStyle = symbol.strokeStyle;
        ctx.lineWidth = symbol.lineWidth;
        const matrix = ctx.getTransform();
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        ctx.beginPath();
        this._coordinates.forEach((point, index) => {
            const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
            if (index === 0) {
                ctx.moveTo(screenX, screenY);
            }
            else {
                ctx.lineTo(screenX, screenY);
            }
        });
        ctx.stroke();
        ctx.restore();
    }
}


/***/ }),

/***/ "../dist/index.js":
/*!************************!*\
  !*** ../dist/index.js ***!
  \************************/
/*! exports provided: Map, Graphic, Geometry, Point, Polyline, Polygon, Layer, GraphicLayer, Projection, WebMercator, Symbol, SimplePointSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Bound */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map */ "../dist/map.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Map", function() { return _map__WEBPACK_IMPORTED_MODULE_0__["Map"]; });

/* harmony import */ var _element_graphic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element/graphic */ "../dist/element/graphic.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Graphic", function() { return _element_graphic__WEBPACK_IMPORTED_MODULE_1__["Graphic"]; });

/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return _geometry_geometry__WEBPACK_IMPORTED_MODULE_2__["Geometry"]; });

/* harmony import */ var _geometry_point__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./geometry/point */ "../dist/geometry/point.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return _geometry_point__WEBPACK_IMPORTED_MODULE_3__["Point"]; });

/* harmony import */ var _geometry_polyline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./geometry/polyline */ "../dist/geometry/polyline.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Polyline", function() { return _geometry_polyline__WEBPACK_IMPORTED_MODULE_4__["Polyline"]; });

/* harmony import */ var _geometry_polygon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./geometry/polygon */ "../dist/geometry/polygon.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Polygon", function() { return _geometry_polygon__WEBPACK_IMPORTED_MODULE_5__["Polygon"]; });

/* harmony import */ var _layer_layer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./layer/layer */ "../dist/layer/layer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Layer", function() { return _layer_layer__WEBPACK_IMPORTED_MODULE_6__["Layer"]; });

/* harmony import */ var _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./layer/graphic-layer */ "../dist/layer/graphic-layer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GraphicLayer", function() { return _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_7__["GraphicLayer"]; });

/* harmony import */ var _projection_projection__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./projection/projection */ "../dist/projection/projection.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Projection", function() { return _projection_projection__WEBPACK_IMPORTED_MODULE_8__["Projection"]; });

/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebMercator", function() { return _projection_web_mercator__WEBPACK_IMPORTED_MODULE_9__["WebMercator"]; });

/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Symbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_10__["Symbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimplePointSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_10__["SimplePointSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleLineSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_10__["SimpleLineSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleFillSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_10__["SimpleFillSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleMarkerSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_10__["SimpleMarkerSymbol"]; });

/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./util/bound */ "../dist/util/bound.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Bound", function() { return _util_bound__WEBPACK_IMPORTED_MODULE_11__["Bound"]; });















/***/ }),

/***/ "../dist/layer/graphic-layer.js":
/*!**************************************!*\
  !*** ../dist/layer/graphic-layer.js ***!
  \**************************************/
/*! exports provided: GraphicLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphicLayer", function() { return GraphicLayer; });
/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layer */ "../dist/layer/layer.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");


class GraphicLayer extends _layer__WEBPACK_IMPORTED_MODULE_0__["Layer"] {
    constructor() {
        super(...arguments);
        this._graphics = [];
    }
    add(graphic) {
        this._graphics.push(graphic);
    }
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound) {
        if (this.visible) {
            this._graphics.forEach((graphic) => {
                graphic.draw(ctx, projection, extent);
            });
        }
    }
}


/***/ }),

/***/ "../dist/layer/layer.js":
/*!******************************!*\
  !*** ../dist/layer/layer.js ***!
  \******************************/
/*! exports provided: Layer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Layer", function() { return Layer; });
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");

class Layer {
    constructor() {
        this._visible = true;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
    }
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"](), extent = projection.bound, zoom = 10) { }
    ;
}


/***/ }),

/***/ "../dist/map.js":
/*!**********************!*\
  !*** ../dist/map.js ***!
  \**********************/
/*! exports provided: Map */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Map", function() { return Map; });
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/bound */ "../dist/util/bound.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony import */ var _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layer/graphic-layer */ "../dist/layer/graphic-layer.js");



class Map {
    constructor(id) {
        this._drag = {
            flag: false,
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            }
        };
        //private _geometries: Geometry[] = [];
        this._defaultGraphicLayer = new _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_2__["GraphicLayer"]();
        this._layers = [];
        //地图缩放等级
        this._zoom = 1;
        //地图视图中心
        this._center = [0, 0];
        //地图事件的handlers
        this._events = {
            "move": [],
            "extent": [] //视图范围更新时，当前关注该事件
        };
        this._container = id instanceof HTMLDivElement ? id : document.getElementById(id);
        //create canvas
        this._canvas = document.createElement("canvas");
        this._canvas.style.cssText = "position: absolute; height: 100%; width: 100%; z-index: 100";
        this._canvas.width = this._container.clientWidth;
        this._canvas.height = this._container.clientHeight;
        this._container.appendChild(this._canvas);
        this._ctx = this._canvas.getContext("2d");
        this._onDoubleClick = this._onDoubleClick.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onWheel = this._onWheel.bind(this);
        this._canvas.addEventListener("dblclick", this._onDoubleClick);
        this._canvas.addEventListener("mousedown", this._onMouseDown);
        this._canvas.addEventListener("mousemove", this._onMouseMove);
        this._canvas.addEventListener("mouseup", this._onMouseUp);
        this._canvas.addEventListener("wheel", this._onWheel);
        //初始化
        this._projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"]();
        this.setView([0, 0], 3);
    }
    get projection() {
        return this._projection;
    }
    //地图事件注册监听
    //TODO: need to off
    on(event, handler) {
        this._events[event].push(handler);
    }
    //设置视图级别及视图中心
    setView(center = [0, 0], zoom = 3) {
        this._center = center;
        this._zoom = Math.max(3, Math.min(20, zoom));
        //center为经纬度，转化为平面坐标
        const origin = this._projection.project(center);
        const bound = this._projection.bound;
        //已知：matrix 转换前 坐标origin，转换后坐标 即canvas的中心 [this._canvas.width / 2, this._canvas.height / 2]
        //求：转换矩阵
        //解法如下：
        const a = 256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale;
        const d = 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale;
        const e = this._canvas.width / 2 - a * origin[0];
        const f = this._canvas.height / 2 - d * origin[1];
        this._ctx.setTransform(a, 0, 0, d, e, f);
        this.redraw();
    }
    //TODO: manage geometry by layer
    /* addGeometry(geometry: Geometry) {
        geometry.draw(this._ctx);
        this._geometries.push(geometry);
    } */
    addLayer(layer) {
        this._layers.push(layer);
        layer.draw(this._ctx, this._projection, this._extent);
    }
    //shortcut
    addGraphic(graphic) {
        this._defaultGraphicLayer.add(graphic);
        graphic.draw(this._ctx, this._projection, this._extent);
    }
    //更新地图视图范围以及中心点
    updateExtent() {
        const matrix = this._ctx.getTransform();
        const x1 = (0 - matrix.e) / matrix.a, y1 = (0 - matrix.f) / matrix.d, x2 = (this._canvas.width - matrix.e) / matrix.a, y2 = (this._canvas.height - matrix.f) / matrix.d;
        this._extent = new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2));
        this._center = this._projection.unproject([(x1 + x2) / 2, (y1 + y2) / 2]);
        this._events.extent.forEach(handler => handler({ extent: this._extent, center: this._center, zoom: this._zoom, matrix: matrix }));
    }
    redraw() {
        this._ctx.save();
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
        this.updateExtent();
        //this._geometries.forEach(geometry => geometry.draw(this._ctx));
        this._defaultGraphicLayer.draw(this._ctx, this._projection, this._extent);
        this._layers.forEach(layer => {
            layer.draw(this._ctx, this._projection, this._extent);
        });
    }
    clear() {
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    _onDoubleClick(event) {
        if (this._zoom >= 20)
            return;
        const scale = 2;
        this._zoom += 1;
        const matrix = this._ctx.getTransform();
        const a1 = matrix.a, e1 = matrix.e, x1 = event.x, x2 = x1; //放大到中心点 x2 = this._canvas.width / 2
        const e = (x2 - scale * (x1 - e1) - e1) / a1;
        const d1 = matrix.d, f1 = matrix.f, y1 = event.y, y2 = y1; //放大到中心点 y2 = this._canvas.height / 2
        const f = (y2 - scale * (y1 - f1) - f1) / d1;
        this._ctx.transform(scale, 0, 0, scale, e, f);
        this.redraw();
    }
    _onMouseDown(event) {
        this._drag.flag = true;
        this._drag.start.x = event.x;
        this._drag.start.y = event.y;
    }
    _onMouseMove(event) {
    }
    _onMouseUp(event) {
        if (this._drag.flag) {
            this._drag.end.x = event.x;
            this._drag.end.y = event.y;
            const matrix = this._ctx.getTransform();
            this._ctx.translate((this._drag.end.x - this._drag.start.x) / matrix.a, (this._drag.end.y - this._drag.start.y) / matrix.d);
            this.redraw();
        }
        this._drag.flag = false;
    }
    _onWheel(event) {
        event.preventDefault();
        const sensitivity = 5;
        if (Math.abs(event.deltaY) <= sensitivity)
            return;
        //const sensitivity = 100;
        //const delta = event.deltaY / sensitivity;
        const delta = event.deltaY < 0 ? -1 : 1;
        let scale = 1;
        if (delta < 0) {
            // 放大
            scale *= delta * -2;
        }
        else {
            // 缩小
            scale /= delta * 2;
        }
        let zoom = Math.round(Math.log(scale));
        if (zoom > 0) {
            // 放大
            zoom = this._zoom + zoom >= 20 ? 20 - this._zoom : zoom;
        }
        else if (zoom < 0) {
            // 缩小
            zoom = this._zoom + zoom <= 3 ? 3 - this._zoom : zoom;
        }
        if (zoom == 0)
            return;
        this._zoom += zoom;
        scale = Math.pow(2, zoom);
        //交互表现为 鼠标当前位置 屏幕坐标不变 进行缩放 即x2 = x1
        //第一种方案，坐标系不变，变坐标值
        //1.将原屏幕坐标 x1 转成 初始坐标 x0 = (x1 - e1) / a1  初始矩阵 (1,0,0,1,0,0)
        //2.初始坐标x0 转成 现屏幕坐标x2  a2 * x0 + e2 = x2    e2 = x2 - a2 * x0  代入1式 e2 = x2 - a2 * (x1 - e1) / a1
        //3.已知scale = a2 / a1  故 e2 = x2 - scale * (x1 - e1)
        //4.另矩阵变换 a1 * e + e1 = e2
        //5.联立3和4  求得 e = (x2 - scale * (x1 - e1) - e1) / a1
        const matrix = this._ctx.getTransform();
        const a1 = matrix.a, e1 = matrix.e, x1 = event.x, x2 = x1; //放大到中心点 x2 = this._canvas.width / 2
        const e = (x2 - scale * (x1 - e1) - e1) / a1;
        const d1 = matrix.d, f1 = matrix.f, y1 = event.y, y2 = y1; //放大到中心点 y2 = this._canvas.height / 2
        const f = (y2 - scale * (y1 - f1) - f1) / d1;
        this._ctx.transform(scale, 0, 0, scale, e, f);
        this.redraw();
    }
    destroy() {
        this._canvas.removeEventListener("dblclick", this._onDoubleClick);
        this._canvas.removeEventListener("mousedown", this._onMouseDown);
        this._canvas.removeEventListener("mousemove", this._onMouseMove);
        this._canvas.removeEventListener("mouseup", this._onMouseUp);
        this._canvas.removeEventListener("wheel", this._onWheel);
    }
}


/***/ }),

/***/ "../dist/projection/projection.js":
/*!****************************************!*\
  !*** ../dist/projection/projection.js ***!
  \****************************************/
/*! exports provided: Projection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Projection", function() { return Projection; });
//TODO: only support web mecator
class Projection {
    //经纬度转平面坐标
    project([lng, lat]) { return []; }
    ;
    //平面坐标转经纬度
    unproject([x, y]) { return []; }
    ;
    //投影后的平面坐标范围
    get bound() { return null; }
    ;
}


/***/ }),

/***/ "../dist/projection/web-mercator.js":
/*!******************************************!*\
  !*** ../dist/projection/web-mercator.js ***!
  \******************************************/
/*! exports provided: WebMercator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebMercator", function() { return WebMercator; });
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _projection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projection */ "../dist/projection/projection.js");


//球体墨卡托
class WebMercator extends _projection__WEBPACK_IMPORTED_MODULE_1__["Projection"] {
    //投影后的平面坐标范围
    get bound() {
        return new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](-Math.PI * WebMercator.R, Math.PI * WebMercator.R, Math.PI * WebMercator.R, -Math.PI * WebMercator.R);
    }
    //经纬度转平面坐标
    project([lng, lat]) {
        //from leaflet & wiki
        const d = Math.PI / 180, sin = Math.sin(lat * d);
        return [WebMercator.R * lng * d, WebMercator.R * Math.log((1 + sin) / (1 - sin)) / 2];
    }
    //平面坐标转经纬度
    unproject([x, y]) {
        const d = 180 / Math.PI;
        return [x * d / WebMercator.R, (2 * Math.atan(Math.exp(y / WebMercator.R)) - (Math.PI / 2)) * d];
    }
}
WebMercator.R = 6378137;


/***/ }),

/***/ "../dist/symbol/symbol.js":
/*!********************************!*\
  !*** ../dist/symbol/symbol.js ***!
  \********************************/
/*! exports provided: Symbol, SimplePointSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Symbol", function() { return Symbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimplePointSymbol", function() { return SimplePointSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleLineSymbol", function() { return SimpleLineSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleFillSymbol", function() { return SimpleFillSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleMarkerSymbol", function() { return SimpleMarkerSymbol; });
class Symbol {
}
class SimplePointSymbol extends Symbol {
    constructor() {
        super(...arguments);
        //circle
        this.radius = 6;
        this.lineWidth = 1;
        this.strokeStyle = "#ff0000"; //#ff0000
        this.fillStyle = "#ff000088"; //#ff0000
    }
}
class SimpleLineSymbol extends Symbol {
    constructor() {
        super(...arguments);
        this.lineWidth = 1;
        this.strokeStyle = "#ff0000"; //#ff0000
    }
}
class SimpleFillSymbol extends Symbol {
    constructor() {
        super(...arguments);
        this.lineWidth = 2;
        this.strokeStyle = "#ff0000"; //#ff0000
        this.fillStyle = "#ff000088"; //#ff0000
    }
}
class SimpleMarkerSymbol extends Symbol {
    constructor() {
        super(...arguments);
        this.width = 16;
        this.height = 16;
        this.offsetX = 8;
        this.offsetY = 8;
    }
    get loaded() {
        return this._loaded;
    }
    load() {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                createImageBitmap(img).then(icon => {
                    this.icon = icon;
                    this._loaded = true;
                    resolve(icon);
                }, err => reject(err));
            };
            img.onerror = reject;
            img.src = this.url;
        });
    }
}


/***/ }),

/***/ "../dist/util/bound.js":
/*!*****************************!*\
  !*** ../dist/util/bound.js ***!
  \*****************************/
/*! exports provided: Bound */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bound", function() { return Bound; });
//边界类，用在包络矩形，以及投影的平面坐标边界
class Bound {
    constructor(xmin, ymin, xmax, ymax) {
        //+1代表 x方向为自西向东，-1则反之
        this._xscale = 1;
        //+1代表 y方向为自北向南，-1则反之
        this._yscale = 1;
        this._xmin = Math.min(xmin, xmax);
        this._ymin = Math.min(ymin, ymax);
        this._xmax = Math.max(xmin, xmax);
        this._ymax = Math.max(ymin, ymax);
        this._xscale = xmin <= xmax ? 1 : -1;
        this._yscale = ymin <= ymax ? 1 : -1;
    }
    get xmin() {
        return this._xmin;
    }
    get ymin() {
        return this._ymin;
    }
    get xmax() {
        return this._xmax;
    }
    get ymax() {
        return this._ymax;
    }
    get xscale() {
        return this._xscale;
    }
    get yscale() {
        return this._yscale;
    }
    getCenter() {
        return [(this._xmin + this._xmax) / 2, (this._ymin + this._ymax) / 2];
    }
    //是否交叉叠盖
    intersect(bound) {
        return (bound.xmax >= this._xmin) && (bound.xmin <= this._xmax) && (bound.ymax >= this._ymin) && (bound.ymin <= this._ymax);
    }
    scale(s) {
        this._xmin = this._xmin - (s - 1) * (this._xmax - this._xmin) / 2;
        this._xmax = this._xmax + (s - 1) * (this._xmax - this._xmin) / 2;
        this._ymin = this._ymin - (s - 1) * (this._ymax - this._ymin) / 2;
        this._ymax = this._ymax + (s - 1) * (this._ymax - this._ymin) / 2;
    }
}


/***/ }),

/***/ "./demo-02.js":
/*!********************!*\
  !*** ./demo-02.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dist__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dist */ "../dist/index.js");


window.load = () => {
    const amap = new AMap.Map("amap", {
        fadeOnZoom: false,
        navigationMode: 'classic',
        optimizePanAnimation: false,
        animateEnable: false,
        dragEnable: false,
        zoomEnable: false,
        resizeEnable: true,
        doubleClickZoom: false,
        keyboardEnable: false,
        scrollWheel: false,
        expandZoomRange: true,
        zooms: [1, 20],
        mapStyle: 'normal',
        features: ['road', 'point', 'bg'],
        viewMode: '2D'
    });

    const map = new _dist__WEBPACK_IMPORTED_MODULE_0__["Map"]("foo");
    map.on("extent", (event) => {
        amap.setZoomAndCenter(event.zoom, event.center);
    });

    /* //画经线
    for (let i = -180; i <= 180; i = i + 10){
        const line = new Polyline([[i, -80], [i, 80]]);
        line.addTo(map);
    }
    //画纬线
    for (let j = -80; j <= 80; j = j + 10){
        const line = new Polyline([[-180, j], [180, j]]);
        line.addTo(map);
    }
    //画经纬线交点
    for (let i = -180; i <= 180; i = i + 10){
        for (let j = -90; j <= 90; j = j + 10){
            const point = new Point(i, j);
            point.addTo(map);
        }
    }*/


    //画经线
    const lngLayer = new _dist__WEBPACK_IMPORTED_MODULE_0__["GraphicLayer"]();
    const lngSymbol = new _dist__WEBPACK_IMPORTED_MODULE_0__["SimpleLineSymbol"]();
    lngSymbol.strokeStyle = "#0000ff";
    for (let i = -180; i <= 180; i = i + 10){
        const line = new _dist__WEBPACK_IMPORTED_MODULE_0__["Polyline"]([[i, -80], [i, 80]]);
        const graphic = new _dist__WEBPACK_IMPORTED_MODULE_0__["Graphic"](line, lngSymbol);
        lngLayer.add(graphic);
    }
    map.addLayer(lngLayer);
    //画纬线
    const latLayer = new _dist__WEBPACK_IMPORTED_MODULE_0__["GraphicLayer"]();
    const latSymbol = new _dist__WEBPACK_IMPORTED_MODULE_0__["SimpleLineSymbol"]();
    lngSymbol.strokeStyle = "#4d9221";
    for (let j = -80; j <= 80; j = j + 10){
        const line = new _dist__WEBPACK_IMPORTED_MODULE_0__["Polyline"]([[-180, j], [180, j]]);
        const graphic = new _dist__WEBPACK_IMPORTED_MODULE_0__["Graphic"](line, latSymbol);
        latLayer.add(graphic);
    }
    map.addLayer(latLayer);
    //画经纬线交点
    const pointLayer = new _dist__WEBPACK_IMPORTED_MODULE_0__["GraphicLayer"]();
    const pointSymbol = new _dist__WEBPACK_IMPORTED_MODULE_0__["SimplePointSymbol"]();
    pointSymbol.radius = 5;
    pointSymbol.fillStyle = "#de77ae";
    pointSymbol.strokeStyle = "#c51b7d";
    for (let i = -180; i <= 180; i = i + 10){
        for (let j = -90; j <= 90; j = j + 10){
            const point = new _dist__WEBPACK_IMPORTED_MODULE_0__["Point"](i, j);
            const graphic = new _dist__WEBPACK_IMPORTED_MODULE_0__["Graphic"](point, pointSymbol);
            pointLayer.add(graphic);
        }
    }
    map.addLayer(pointLayer);

    /* const point = new Point(116.397411,39.909186);
    point.addTo(map); */

    //beijing gugong
    const marker = new _dist__WEBPACK_IMPORTED_MODULE_0__["SimpleMarkerSymbol"]();
    marker.width = 32;
    marker.height = 32;
    marker.offsetX = 16;
    marker.offsetY = 32;
    marker.url = "assets/img/marker.svg";
    const point = new _dist__WEBPACK_IMPORTED_MODULE_0__["Point"](116.397411,39.909186);
    const graphic = new _dist__WEBPACK_IMPORTED_MODULE_0__["Graphic"](point, marker);
    map.addGraphic(graphic);

    map.setView([0, 0], 5);
}

//cause typescript tsc forget js suffix for geometry.js

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map