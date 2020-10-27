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
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../dist/analysis/heat/heat.js":
/*!*************************************!*\
  !*** ../dist/analysis/heat/heat.js ***!
  \*************************************/
/*! exports provided: Heat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Heat", function() { return Heat; });
/* harmony import */ var _element_raster__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../element/raster */ "../dist/element/raster.js");
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../projection/web-mercator */ "../dist/projection/web-mercator.js");



/*
 * 热力图
 * https://juejin.im/post/6844903709244129293
 */
class Heat extends _element_raster__WEBPACK_IMPORTED_MODULE_0__["Raster"] {
    /**
     * 创建热力图
     */
    constructor() {
        super(0, 0, 0, 0);
        /**
         * 热力半径
         */
        this.radius = 40; //px
        /**
         * 渐变色
         */
        this.gradient = [
            { step: 0.3, color: "blue" },
            { step: 0.5, color: "lime" },
            { step: 0.7, color: "yellow" },
            { step: 1, color: "red" }
        ];
        /*
        * 蜂窝显示
        */
        this.honey = false;
        /*
        * 蜂窝边长
        */
        this.honeySide = 10;
    }
    /*
    * 动态栅格（实时渲染）
    */
    get dynamic() {
        return true;
    }
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = value;
    }
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = value;
    }
    /*
     * 初始化
     * @param {FeatureClass} featureClass - 点要素类
     * @param {Field} field - 值字段
     */
    generate(featureClass, field) {
        if (featureClass.type != _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Point)
            return;
        this._featureClass = featureClass;
        this._field = field;
        const values = featureClass.features.map(feature => feature.properties[field.name]);
        this._min = this._min || Math.min(...values), this._max = this._max || Math.max(...values);
        //初始化色带，256个颜色，1个像素代表1个颜色
        this._ramp = document.createElement("canvas");
        const ramp = this._ramp.getContext('2d');
        this._ramp.width = 256;
        this._ramp.height = 1;
        const grd = ramp.createLinearGradient(0, 0, this._ramp.width, this._ramp.height);
        this.gradient.forEach(item => {
            grd.addColorStop(item.step, item.color);
        });
        ramp.fillStyle = grd;
        ramp.fillRect(0, 0, this._ramp.width, this._ramp.height);
    }
    /**
     * 绘制栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"](), extent = projection.bound, zoom = 10) {
        //绘制alpha通道图，类似灰度图
        const canvas = document.createElement("canvas");
        canvas.width = ctx.canvas.width;
        canvas.height = ctx.canvas.height;
        const gray = canvas.getContext("2d");
        //遍历要素集合，根据字段值画alpha通道图
        this._featureClass.features.forEach((feature) => {
            const value = feature.properties[this._field.name];
            if (value != undefined) {
                const alpha = (value - this._min) / (this._max - this._min);
                const point = feature.geometry;
                point.project(projection);
                const matrix = ctx.getTransform();
                const screenX = (matrix.a * point.x + matrix.e);
                const screenY = (matrix.d * point.y + matrix.f);
                gray.save();
                gray.lineWidth = 0;
                const radgrad = gray.createRadialGradient(screenX, screenY, 0, screenX, screenY, this.radius);
                radgrad.addColorStop(0, "rgba(0, 0, 0, 1)");
                radgrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                gray.fillStyle = radgrad;
                gray.globalAlpha = alpha;
                gray.beginPath(); //Start path
                gray.arc(screenX, screenY, this.radius, 0, Math.PI * 2, true);
                gray.fill();
                gray.restore();
            }
        });
        //根据alpha值找到色带中对应颜色
        const colorData = this._ramp.getContext("2d").getImageData(0, 0, 256, 1).data;
        const imgData = gray.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        if (this.honey) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.strokeStyle = "#ffffff88";
            ctx.lineWidth = 1;
            let flag = 0; //奇偶标志
            for (let y = 0; y <= canvas.height; y = Math.floor(y + this.honeySide * 1.732 / 2)) {
                for (let x = 0 + flag * (3 / 2 * this.honeySide); x <= canvas.width; x = x + 3 * this.honeySide) {
                    const index = (y * canvas.width + x) * 4;
                    const alpha = data[index + 3];
                    //const pixelData = gray.getImageData(x, y, 1, 1);
                    //const pixel = pixelData.data;
                    //const alpha = pixel[3];
                    if (alpha != 0) {
                        ctx.fillStyle = "rgba(" + colorData[4 * alpha] + "," + colorData[4 * alpha + 1] + "," + colorData[4 * alpha + 2] + "," + alpha / 255 + ")";
                        //ctx.fillStyle ="rgba(255,0,0,0.5)";
                        ctx.beginPath();
                        ctx.moveTo(x - this.honeySide, y);
                        ctx.lineTo(x - 1 / 2 * this.honeySide, Math.floor(y - this.honeySide * 1.732 / 2));
                        ctx.lineTo(x + 1 / 2 * this.honeySide, Math.floor(y - this.honeySide * 1.732 / 2));
                        ctx.lineTo(x + this.honeySide, y);
                        ctx.lineTo(x + 1 / 2 * this.honeySide, Math.floor(y + this.honeySide * 1.732 / 2));
                        ctx.lineTo(x - 1 / 2 * this.honeySide, Math.floor(y + this.honeySide * 1.732 / 2));
                        ctx.lineTo(x - this.honeySide, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                }
                flag = flag === 0 ? 1 : 0;
            }
            ctx.restore();
        }
        else {
            for (let i = 0; i < data.length; i++) {
                const value = data[i];
                //只有alpha是有值，R，G，B待设置
                if (value > 0) {
                    //alpha值，对应colorData数组下标
                    data[i - 3] = colorData[4 * value]; //R
                    data[i - 2] = colorData[4 * value + 1]; //G
                    data[i - 1] = colorData[4 * value + 2]; //B
                }
            }
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(imgData, 0, 0);
            ctx.restore();
        }
    }
}


/***/ }),

/***/ "../dist/analysis/interpolation/inverse-distance-weight.js":
/*!*****************************************************************!*\
  !*** ../dist/analysis/interpolation/inverse-distance-weight.js ***!
  \*****************************************************************/
/*! exports provided: InverseDistanceWeight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InverseDistanceWeight", function() { return InverseDistanceWeight; });
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony import */ var _element_raster__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../element/raster */ "../dist/element/raster.js");



/*
 * 反距离加权法（Inverse Distance Weighted）插值
 */
class InverseDistanceWeight extends _element_raster__WEBPACK_IMPORTED_MODULE_2__["Raster"] {
    /**
     * 创建插值
     */
    constructor() {
        super(0, 0, 0, 0);
        /**
         * 衰减半径
         */
        this.radius = 2000; //m 平面距离
        /**
         * 分辨率
         */
        this.resolution = 10; //
        /**
         * 渐变色
         */
        //["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"]
        this.gradient = [
            { step: 0, color: "#006837" },
            { step: 0.1, color: "#1a9850" },
            { step: 0.2, color: "#66bd63" },
            { step: 0.3, color: "#a6d96a" },
            { step: 0.4, color: "#d9ef8b" },
            { step: 0.5, color: "#ffffbf" },
            { step: 0.6, color: "#fee08b" },
            { step: 0.7, color: "#fdae61" },
            { step: 0.8, color: "#f46d43" },
            { step: 0.9, color: "#d73027" },
            { step: 1, color: "#a50026" }
        ];
        /**
         * 反距离函数
         */
        this.decay = (distance) => {
            return 1 / Math.pow(distance, 3);
        };
        /*
        * 蜂窝显示
        */
        this.honey = false;
        /*
        * 蜂窝边长
        */
        this.honeySide = 10;
        /*
        * 蜂窝颜色
        */
        this.honeyColor = "#ffffff88";
    }
    /*
    * 动态栅格（实时渲染）
    */
    get dynamic() {
        return true;
    }
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = value;
    }
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = value;
    }
    /*
     * 初始化
     * @param {FeatureClass} featureClass - 点要素类
     * @param {Field} field - 值字段
     */
    generate(featureClass, field) {
        if (featureClass.type != _geometry_geometry__WEBPACK_IMPORTED_MODULE_0__["GeometryType"].Point)
            return;
        this._featureClass = featureClass;
        this._field = field;
        const values = featureClass.features.map(feature => feature.properties[field.name]);
        this._min = this._min || Math.min(...values), this._max = this._max || Math.max(...values);
        //初始化色带，256个颜色，1个像素代表1个颜色
        this._ramp = document.createElement("canvas");
        const ramp = this._ramp.getContext('2d');
        this._ramp.width = 256;
        this._ramp.height = 1;
        const grd = ramp.createLinearGradient(0, 0, this._ramp.width, this._ramp.height);
        this.gradient.forEach(item => {
            grd.addColorStop(item.step, item.color);
        });
        ramp.fillStyle = grd;
        ramp.fillRect(0, 0, this._ramp.width, this._ramp.height);
    }
    /**
     * 绘制栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10) {
        const valueData = [];
        const matrix = ctx.getTransform();
        //抽稀
        /*const cluster = this._featureClass.features.reduce( (acc, cur) => {
            if (cur.geometry instanceof Point) {
                const point: Point = cur.geometry;
                const item: any = acc.find((item: any) => {
                    const distance = point.distance(item.geometry, CoordinateType.Screen, ctx, projection);
                    return distance <= 20;
                });
                if (!item) acc.push(cur);
                return acc;
            }
        }, []);*/
        //生成(x,y,value),
        //1.如x,y地理平面坐标，则可放到初始化代码中；
        //2.如x,y屏幕平面坐标，则放在此处，每次重绘重新坐标变换；
        this._featureClass.features.forEach((feature) => {
            const value = feature.properties[this._field.name];
            if (value != undefined) {
                const point = feature.geometry;
                point.project(projection);
                const screenX = (matrix.a * point.x + matrix.e);
                const screenY = (matrix.d * point.y + matrix.f);
                valueData.push([screenX, screenY, (value - this._min) / (this._max - this._min)]);
            }
        });
        //根据alpha值找到色带中对应颜色
        const colorData = this._ramp.getContext("2d").getImageData(0, 0, 256, 1).data;
        //是否采用蜂窝网格渲染
        if (this.honey) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.strokeStyle = this.honeyColor;
            ctx.lineWidth = 1;
            let flag = 0; //奇偶标志
            //循环y轴
            for (let y = 0; y <= ctx.canvas.height; y = Math.floor(y + this.honeySide * 1.732 / 2)) {
                //循环x轴
                for (let x = 0 + flag * (3 / 2 * this.honeySide); x <= ctx.canvas.width; x = x + 3 * this.honeySide) {
                    //通过蜂窝网格中心点(x,y)，计算该点的反距离插值
                    let values = 0, weights = 0;
                    valueData.forEach(item => {
                        let distance = Math.sqrt((item[0] - x) * (item[0] - x) + (item[1] - y) * (item[1] - y));
                        distance = distance < 1 ? 1 : distance;
                        let weight = this.decay(distance);
                        values += weight * item[2];
                        weights += weight;
                    });
                    if (weights) {
                        //插值对比色带，找到填充色，填充整个网格
                        const alpha = Math.floor(values / weights * 255);
                        ctx.fillStyle = "rgba(" + colorData[4 * alpha] + "," + colorData[4 * alpha + 1] + "," + colorData[4 * alpha + 2] + "," + alpha / 255 + ")";
                        ctx.beginPath();
                        //绘制蜂窝网格
                        ctx.moveTo(x - this.honeySide, y);
                        ctx.lineTo(x - 1 / 2 * this.honeySide, Math.floor(y - this.honeySide * 1.732 / 2));
                        ctx.lineTo(x + 1 / 2 * this.honeySide, Math.floor(y - this.honeySide * 1.732 / 2));
                        ctx.lineTo(x + this.honeySide, y);
                        ctx.lineTo(x + 1 / 2 * this.honeySide, Math.floor(y + this.honeySide * 1.732 / 2));
                        ctx.lineTo(x - 1 / 2 * this.honeySide, Math.floor(y + this.honeySide * 1.732 / 2));
                        ctx.lineTo(x - this.honeySide, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                }
                //奇偶行换位
                flag = flag === 0 ? 1 : 0;
            }
            ctx.restore();
        }
        else {
            const canvas = document.createElement("canvas");
            canvas.width = ctx.canvas.width / this.resolution;
            canvas.height = ctx.canvas.height / this.resolution;
            const gray = canvas.getContext("2d");
            const imgData = gray.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            for (let i = 0; i < data.length; i = i + 4) {
                const screenY = i / (4 * canvas.width) * this.resolution, screenX = i / 4 % canvas.width * this.resolution;
                let values = 0, weights = 0;
                //加权
                valueData.forEach(item => {
                    let distance = Math.sqrt((item[0] - screenX) * (item[0] - screenX) + (item[1] - screenY) * (item[1] - screenY));
                    distance = distance < 1 ? 1 : distance;
                    let weight = this.decay(distance);
                    values += weight * item[2];
                    weights += weight;
                });
                //像素RGB赋值，赋值方式参考热力图
                if (weights) {
                    const alpha = Math.floor(values / weights * 255);
                    data[i] = colorData[4 * alpha]; //R
                    data[i + 1] = colorData[4 * alpha + 1]; //G
                    data[i + 2] = colorData[4 * alpha + 2]; //B
                    data[i + 3] = alpha;
                }
            }
            gray.putImageData(imgData, 0, 0);
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        }
    }
}


/***/ }),

/***/ "../dist/analysis/interpolation/kriging.js":
/*!*************************************************!*\
  !*** ../dist/analysis/interpolation/kriging.js ***!
  \*************************************************/
/*! exports provided: Kriging */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Kriging", function() { return Kriging; });
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony import */ var _element_raster__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../element/raster */ "../dist/element/raster.js");



/*
 * 克里金插值
 * http://oeo4b.github.io/#documentation
 * https://rawgit.com/oeo4b/kriging.js/master/kriging.js
 */
class Kriging extends _element_raster__WEBPACK_IMPORTED_MODULE_2__["Raster"] {
    /**
     * 创建克里金插值
     * @param {number} xmin - 经度左值
     * @param {number} ymin - 纬度下值
     * @param {number} xmax - 经度右值
     * @param {number} ymax - 纬度上值
     * @param {number} width - 栅格宽度
     * @param {number} height - 栅格高度
     * @param {number} cellsize - 栅格大小
     */
    constructor(xmin, ymin, xmax, ymax, width = 1000, height = 1000, cellsize = 4) {
        super(xmin, ymin, xmax, ymax, width, height);
        /*
         * 渲染颜色
         */
        this.colors = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"];
        /*
         * 插值算法
         */
        this.model = "exponential";
        /*
         * 精度 分辨率 1 block = 4 px
         */
        this.cellSize = 4;
        this.cellSize = cellsize;
    }
    // Matrix algebra
    _kriging_matrix_diag(c, n) {
        let i, Z = Array(n * n).fill(0);
        for (i = 0; i < n; i++)
            Z[i * n + i] = c;
        return Z;
    }
    ;
    _kriging_matrix_transpose(X, n, m) {
        let i, j, Z = Array(m * n);
        for (i = 0; i < n; i++)
            for (j = 0; j < m; j++)
                Z[j * n + i] = X[i * m + j];
        return Z;
    }
    ;
    _kriging_matrix_scale(X, c, n, m) {
        let i, j;
        for (i = 0; i < n; i++)
            for (j = 0; j < m; j++)
                X[i * m + j] *= c;
    }
    ;
    _kriging_matrix_add(X, Y, n, m) {
        let i, j, Z = Array(n * m);
        for (i = 0; i < n; i++)
            for (j = 0; j < m; j++)
                Z[i * m + j] = X[i * m + j] + Y[i * m + j];
        return Z;
    }
    ;
    // Naive matrix multiplication
    _kriging_matrix_multiply(X, Y, n, m, p) {
        let i, j, k, Z = Array(n * p);
        for (i = 0; i < n; i++) {
            for (j = 0; j < p; j++) {
                Z[i * p + j] = 0;
                for (k = 0; k < m; k++)
                    Z[i * p + j] += X[i * m + k] * Y[k * p + j];
            }
        }
        return Z;
    }
    ;
    // Cholesky decomposition
    _kriging_matrix_chol(X, n) {
        let i, j, k, sum, p = Array(n);
        for (i = 0; i < n; i++)
            p[i] = X[i * n + i];
        for (i = 0; i < n; i++) {
            for (j = 0; j < i; j++)
                p[i] -= X[i * n + j] * X[i * n + j];
            if (p[i] <= 0)
                return false;
            p[i] = Math.sqrt(p[i]);
            for (j = i + 1; j < n; j++) {
                for (k = 0; k < i; k++)
                    X[j * n + i] -= X[j * n + k] * X[i * n + k];
                X[j * n + i] /= p[i];
            }
        }
        for (i = 0; i < n; i++)
            X[i * n + i] = p[i];
        return true;
    }
    ;
    // Inversion of cholesky decomposition
    _kriging_matrix_chol2inv(X, n) {
        let i, j, k, sum;
        for (i = 0; i < n; i++) {
            X[i * n + i] = 1 / X[i * n + i];
            for (j = i + 1; j < n; j++) {
                sum = 0;
                for (k = i; k < j; k++)
                    sum -= X[j * n + k] * X[k * n + i];
                X[j * n + i] = sum / X[j * n + j];
            }
        }
        for (i = 0; i < n; i++)
            for (j = i + 1; j < n; j++)
                X[i * n + j] = 0;
        for (i = 0; i < n; i++) {
            X[i * n + i] *= X[i * n + i];
            for (k = i + 1; k < n; k++)
                X[i * n + i] += X[k * n + i] * X[k * n + i];
            for (j = i + 1; j < n; j++)
                for (k = j; k < n; k++)
                    X[i * n + j] += X[k * n + i] * X[k * n + j];
        }
        for (i = 0; i < n; i++)
            for (j = 0; j < i; j++)
                X[i * n + j] = X[j * n + i];
    }
    ;
    // Inversion via gauss-jordan elimination
    _kriging_matrix_solve(X, n) {
        let m = n;
        let b = Array(n * n);
        let indxc = Array(n);
        let indxr = Array(n);
        let ipiv = Array(n);
        let i, icol, irow, j, k, l, ll;
        let big, dum, pivinv, temp;
        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++) {
                if (i == j)
                    b[i * n + j] = 1;
                else
                    b[i * n + j] = 0;
            }
        for (j = 0; j < n; j++)
            ipiv[j] = 0;
        for (i = 0; i < n; i++) {
            big = 0;
            for (j = 0; j < n; j++) {
                if (ipiv[j] != 1) {
                    for (k = 0; k < n; k++) {
                        if (ipiv[k] == 0) {
                            if (Math.abs(X[j * n + k]) >= big) {
                                big = Math.abs(X[j * n + k]);
                                irow = j;
                                icol = k;
                            }
                        }
                    }
                }
            }
            ++(ipiv[icol]);
            if (irow != icol) {
                for (l = 0; l < n; l++) {
                    temp = X[irow * n + l];
                    X[irow * n + l] = X[icol * n + l];
                    X[icol * n + l] = temp;
                }
                for (l = 0; l < m; l++) {
                    temp = b[irow * n + l];
                    b[irow * n + l] = b[icol * n + l];
                    b[icol * n + l] = temp;
                }
            }
            indxr[i] = irow;
            indxc[i] = icol;
            if (X[icol * n + icol] == 0)
                return false; // Singular
            pivinv = 1 / X[icol * n + icol];
            X[icol * n + icol] = 1;
            for (l = 0; l < n; l++)
                X[icol * n + l] *= pivinv;
            for (l = 0; l < m; l++)
                b[icol * n + l] *= pivinv;
            for (ll = 0; ll < n; ll++) {
                if (ll != icol) {
                    dum = X[ll * n + icol];
                    X[ll * n + icol] = 0;
                    for (l = 0; l < n; l++)
                        X[ll * n + l] -= X[icol * n + l] * dum;
                    for (l = 0; l < m; l++)
                        b[ll * n + l] -= b[icol * n + l] * dum;
                }
            }
        }
        for (l = (n - 1); l >= 0; l--)
            if (indxr[l] != indxc[l]) {
                for (k = 0; k < n; k++) {
                    temp = X[k * n + indxr[l]];
                    X[k * n + indxr[l]] = X[k * n + indxc[l]];
                    X[k * n + indxc[l]] = temp;
                }
            }
        return true;
    }
    // Variogram models
    _kriging_variogram_gaussian(h, nugget, range, sill, A) {
        return nugget + ((sill - nugget) / range) *
            (1.0 - Math.exp(-(1.0 / A) * Math.pow(h / range, 2)));
    }
    ;
    _kriging_variogram_exponential(h, nugget, range, sill, A) {
        return nugget + ((sill - nugget) / range) *
            (1.0 - Math.exp(-(1.0 / A) * (h / range)));
    }
    ;
    _kriging_variogram_spherical(h, nugget, range, sill, A) {
        if (h > range)
            return nugget + (sill - nugget) / range;
        return nugget + ((sill - nugget) / range) *
            (1.5 * (h / range) - 0.5 * Math.pow(h / range, 3));
    }
    ;
    // Train using gaussian processes with bayesian priors
    train(t, x, y, model, sigma2, alpha) {
        let variogram = {
            t: t,
            x: x,
            y: y,
            nugget: 0.0,
            range: 0.0,
            sill: 0.0,
            A: 1 / 3,
            n: 0,
            model: null,
            K: null,
            M: null
        };
        switch (model) {
            case "gaussian":
                variogram.model = this._kriging_variogram_gaussian;
                break;
            case "exponential":
                variogram.model = this._kriging_variogram_exponential;
                break;
            case "spherical":
                variogram.model = this._kriging_variogram_spherical;
                break;
        }
        ;
        // Lag distance/semivariance
        let i, j, k, l, n = t.length;
        let distance = Array((n * n - n) / 2);
        for (i = 0, k = 0; i < n; i++)
            for (j = 0; j < i; j++, k++) {
                distance[k] = Array(2);
                distance[k][0] = Math.pow(Math.pow(x[i] - x[j], 2) +
                    Math.pow(y[i] - y[j], 2), 0.5);
                distance[k][1] = Math.abs(t[i] - t[j]);
            }
        distance.sort((a, b) => { return a[0] - b[0]; });
        variogram.range = distance[(n * n - n) / 2 - 1][0];
        // Bin lag distance
        let lags = ((n * n - n) / 2) > 30 ? 30 : (n * n - n) / 2;
        let tolerance = variogram.range / lags;
        let lag = Array(lags).fill(0);
        let semi = Array(lags).fill(0);
        if (lags < 30) {
            for (l = 0; l < lags; l++) {
                lag[l] = distance[l][0];
                semi[l] = distance[l][1];
            }
        }
        else {
            for (i = 0, j = 0, k = 0, l = 0; i < lags && j < ((n * n - n) / 2); i++, k = 0) {
                while (distance[j][0] <= ((i + 1) * tolerance)) {
                    lag[l] += distance[j][0];
                    semi[l] += distance[j][1];
                    j++;
                    k++;
                    if (j >= ((n * n - n) / 2))
                        break;
                }
                if (k > 0) {
                    lag[l] /= k;
                    semi[l] /= k;
                    l++;
                }
            }
            if (l < 2)
                return variogram; // Error: Not enough points
        }
        // Feature transformation
        n = l;
        variogram.range = lag[n - 1] - lag[0];
        let X = Array(2 * n).fill(1);
        let Y = Array(n);
        let A = variogram.A;
        for (i = 0; i < n; i++) {
            switch (model) {
                case "gaussian":
                    X[i * 2 + 1] = 1.0 - Math.exp(-(1.0 / A) * Math.pow(lag[i] / variogram.range, 2));
                    break;
                case "exponential":
                    X[i * 2 + 1] = 1.0 - Math.exp(-(1.0 / A) * lag[i] / variogram.range);
                    break;
                case "spherical":
                    X[i * 2 + 1] = 1.5 * (lag[i] / variogram.range) -
                        0.5 * Math.pow(lag[i] / variogram.range, 3);
                    break;
            }
            ;
            Y[i] = semi[i];
        }
        // Least squares
        let Xt = this._kriging_matrix_transpose(X, n, 2);
        let Z = this._kriging_matrix_multiply(Xt, X, 2, n, 2);
        Z = this._kriging_matrix_add(Z, this._kriging_matrix_diag(1 / alpha, 2), 2, 2);
        let cloneZ = Z.slice(0);
        if (this._kriging_matrix_chol(Z, 2))
            this._kriging_matrix_chol2inv(Z, 2);
        else {
            this._kriging_matrix_solve(cloneZ, 2);
            Z = cloneZ;
        }
        let W = this._kriging_matrix_multiply(this._kriging_matrix_multiply(Z, Xt, 2, 2, n), Y, 2, n, 1);
        // Variogram parameters
        variogram.nugget = W[0];
        variogram.sill = W[1] * variogram.range + variogram.nugget;
        variogram.n = x.length;
        // Gram matrix with prior
        n = x.length;
        let K = Array(n * n);
        for (i = 0; i < n; i++) {
            for (j = 0; j < i; j++) {
                K[i * n + j] = variogram.model(Math.pow(Math.pow(x[i] - x[j], 2) +
                    Math.pow(y[i] - y[j], 2), 0.5), variogram.nugget, variogram.range, variogram.sill, variogram.A);
                K[j * n + i] = K[i * n + j];
            }
            K[i * n + i] = variogram.model(0, variogram.nugget, variogram.range, variogram.sill, variogram.A);
        }
        // Inverse penalized Gram matrix projected to target vector
        let C = this._kriging_matrix_add(K, this._kriging_matrix_diag(sigma2, n), n, n);
        let cloneC = C.slice(0);
        if (this._kriging_matrix_chol(C, n))
            this._kriging_matrix_chol2inv(C, n);
        else {
            this._kriging_matrix_solve(cloneC, n);
            C = cloneC;
        }
        // Copy unprojected inverted matrix as K
        let K2 = C.slice(0);
        let M = this._kriging_matrix_multiply(C, t, n, n, 1);
        variogram.K = K2;
        variogram.M = M;
        return variogram;
    }
    ;
    // Model prediction
    predict(x, y, variogram) {
        var i, k = Array(variogram.n);
        for (i = 0; i < variogram.n; i++)
            k[i] = variogram.model(Math.pow(Math.pow(x - variogram.x[i], 2) +
                Math.pow(y - variogram.y[i], 2), 0.5), variogram.nugget, variogram.range, variogram.sill, variogram.A);
        return this._kriging_matrix_multiply(k, variogram.M, 1, variogram.n, 1)[0];
    }
    ;
    variance(x, y, variogram) {
        var i, k = Array(variogram.n);
        for (i = 0; i < variogram.n; i++)
            k[i] = variogram.model(Math.pow(Math.pow(x - variogram.x[i], 2) +
                Math.pow(y - variogram.y[i], 2), 0.5), variogram.nugget, variogram.range, variogram.sill, variogram.A);
        return variogram.model(0, variogram.nugget, variogram.range, variogram.sill, variogram.A) +
            this._kriging_matrix_multiply(this._kriging_matrix_multiply(k, variogram.K, 1, variogram.n, variogram.n), k, 1, variogram.n, 1)[0];
    }
    ;
    // Gridded matrices or contour paths
    grid(polygons, variogram, width) {
        var i, j, k, n = polygons.length;
        if (n == 0)
            return;
        // Boundaries of polygons space
        var xlim = [polygons[0][0][0], polygons[0][0][0]];
        var ylim = [polygons[0][0][1], polygons[0][0][1]];
        for (i = 0; i < n; i++) // Polygons
            for (j = 0; j < polygons[i].length; j++) { // Vertices
                if (polygons[i][j][0] < xlim[0])
                    xlim[0] = polygons[i][j][0];
                if (polygons[i][j][0] > xlim[1])
                    xlim[1] = polygons[i][j][0];
                if (polygons[i][j][1] < ylim[0])
                    ylim[0] = polygons[i][j][1];
                if (polygons[i][j][1] > ylim[1])
                    ylim[1] = polygons[i][j][1];
            }
        // Alloc for O(n^2) space
        var xtarget, ytarget;
        var a = Array(2), b = Array(2);
        var lxlim = Array(2); // Local dimensions
        var lylim = Array(2); // Local dimensions
        var x = Math.ceil((xlim[1] - xlim[0]) / width);
        var y = Math.ceil((ylim[1] - ylim[0]) / width);
        var A = Array(x + 1);
        const _pip = (array, x, y) => {
            let i, j, c = false;
            for (i = 0, j = array.length - 1; i < array.length; j = i++) {
                if (((array[i][1] > y) != (array[j][1] > y)) &&
                    (x < (array[j][0] - array[i][0]) * (y - array[i][1]) / (array[j][1] - array[i][1]) + array[i][0])) {
                    c = !c;
                }
            }
            return c;
        };
        for (i = 0; i <= x; i++)
            A[i] = Array(y + 1);
        for (i = 0; i < n; i++) {
            // Range for polygons[i]
            lxlim[0] = polygons[i][0][0];
            lxlim[1] = lxlim[0];
            lylim[0] = polygons[i][0][1];
            lylim[1] = lylim[0];
            for (j = 1; j < polygons[i].length; j++) { // Vertices
                if (polygons[i][j][0] < lxlim[0])
                    lxlim[0] = polygons[i][j][0];
                if (polygons[i][j][0] > lxlim[1])
                    lxlim[1] = polygons[i][j][0];
                if (polygons[i][j][1] < lylim[0])
                    lylim[0] = polygons[i][j][1];
                if (polygons[i][j][1] > lylim[1])
                    lylim[1] = polygons[i][j][1];
            }
            // Loop through polygon subspace
            a[0] = Math.floor(((lxlim[0] - ((lxlim[0] - xlim[0]) % width)) - xlim[0]) / width);
            a[1] = Math.ceil(((lxlim[1] - ((lxlim[1] - xlim[1]) % width)) - xlim[0]) / width);
            b[0] = Math.floor(((lylim[0] - ((lylim[0] - ylim[0]) % width)) - ylim[0]) / width);
            b[1] = Math.ceil(((lylim[1] - ((lylim[1] - ylim[1]) % width)) - ylim[0]) / width);
            for (j = a[0]; j <= a[1]; j++)
                for (k = b[0]; k <= b[1]; k++) {
                    xtarget = xlim[0] + j * width;
                    ytarget = ylim[0] + k * width;
                    if (_pip(polygons[i], xtarget, ytarget))
                        A[j][k] = this.predict(xtarget, ytarget, variogram);
                }
        }
        return {
            A: A,
            xlim: xlim,
            ylim: ylim,
            zlim: [Math.min(...variogram.t), Math.max(...variogram.t)],
            width: width
        };
    }
    ;
    contour(value, polygons, variogram) {
    }
    ;
    plot(grid, xlim, ylim, colors) {
        // Clear screen
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Starting boundaries
        var range = [xlim[1] - xlim[0], ylim[1] - ylim[0], grid.zlim[1] - grid.zlim[0]];
        var i, j, x, y, z;
        var n = grid.A.length;
        var m = grid.A[0].length;
        var wx = Math.ceil(grid.width * this.canvas.width / (xlim[1] - xlim[0]));
        var wy = Math.ceil(grid.width * this.canvas.height / (ylim[1] - ylim[0]));
        for (i = 0; i < n; i++) {
            for (j = 0; j < m; j++) {
                if (grid.A[i][j] == undefined)
                    continue;
                x = this.canvas.width * (i * grid.width + grid.xlim[0] - xlim[0]) / range[0];
                y = this.canvas.height * (1 - (j * grid.width + grid.ylim[0] - ylim[0]) / range[1]);
                z = (grid.A[i][j] - grid.zlim[0]) / range[2];
                if (z < 0.0)
                    z = 0.0;
                if (z > 1.0)
                    z = 1.0;
                ctx.fillStyle = colors[Math.floor((colors.length - 1) * z)];
                ctx.fillRect(Math.round(x - wx / 2), Math.round(y - wy / 2), wx, wy);
            }
        }
    }
    ;
    /*
     * 生成插值
     * @param {FeatureClass} featureClass - 插值点要素类
     * @param {Field} field - 插值字段
     */
    generate(featureClass, field) {
        if (featureClass.type != _geometry_geometry__WEBPACK_IMPORTED_MODULE_0__["GeometryType"].Point)
            return;
        const values = featureClass.features.map(feature => feature.properties[field.name]);
        const lngs = featureClass.features.map(feature => feature.geometry.lng);
        const lats = featureClass.features.map(feature => feature.geometry.lat);
        const variogram = this.train(values, lngs, lats, this.model, 0, 100);
        const bound = this.bound;
        const boundary = [[[bound.xmin, bound.ymin], [bound.xmin, bound.ymax], [bound.xmax, bound.ymax], [bound.xmax, bound.ymin]]];
        const grid = this.grid(boundary, variogram, (bound.ymax - bound.ymin) / (this.canvas.height / this.cellSize));
        this.plot(grid, [bound.xmin, bound.xmax], [bound.ymin, bound.ymax], this.colors);
    }
    /**
     * 绘制栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10) {
        let [xmin, ymax] = projection.project([this.bound.xmin, this.bound.ymax]);
        let [xmax, ymin] = projection.project([this.bound.xmax, this.bound.ymin]);
        ctx.save();
        const matrix = ctx.getTransform();
        let screenXMin = (matrix.a * xmin + matrix.e);
        let screenYMin = (matrix.d * ymax + matrix.f);
        let screenXMax = (matrix.a * xmax + matrix.e);
        let screenYMax = (matrix.d * ymin + matrix.f);
        //keep size
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //this.resample(this.canvas, this.canvas.width, this.canvas.height, false);
        ctx.drawImage(this.canvas, screenXMin, screenYMin, screenXMax - screenXMin, screenYMax - screenYMin);
        ctx.restore();
    }
}


/***/ }),

/***/ "../dist/animation/animation.js":
/*!**************************************!*\
  !*** ../dist/animation/animation.js ***!
  \**************************************/
/*! exports provided: Animation, PointAnimation, LineAnimation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animation", function() { return Animation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PointAnimation", function() { return PointAnimation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LineAnimation", function() { return LineAnimation; });
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");

/**
 * 动画效果基类
 * @remarks
 * 动画两种实现方式：
 * 1.针对单个图形要素，实现动画，使用时，逻辑较清晰；
 * 2.针对整个图层，类似Symbol，使用时，可能存在效率问题；
 * 目前暂实现1，针对2，目前保留部分已注释的代码，便于日后参考。
 */
class Animation {
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"]()) {
    }
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed, ctx) {
    }
}
/**
 * 点默认动画效果类
 * @remarks
 * 类似flashing效果，从中心点向外光环扩散效果
 */
class PointAnimation extends Animation {
    //radius: number = this.limit / this.ring;
    /**
     * 创建动画效果
     * @param {Point} geometry - 点
     */
    constructor(geometry) {
        super();
        /**
         * 边宽
         */
        this.lineWidth = 2;
        /**
         * 颜色
         */
        this.color = "#ff0000";
        /**
         * 扩散速度
         */
        this.velocity = 10; //  px/s
        /**
         * 扩散的最大半径
         */
        this.limit = 30;
        /**
         * 扩散的光圈数
         */
        this.ring = 3;
        this._point = geometry;
    }
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"]()) {
        this._point.project(projection);
        const matrix = ctx.getTransform();
        this._screenX = (matrix.a * this._point.x + matrix.e);
        this._screenY = (matrix.d * this._point.y + matrix.f);
        /*ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        //keep size
        //地理坐标 转回 屏幕坐标
        ctx.setTransform(1,0,0,1,0,0);
        ctx.beginPath(); //Start path
        ctx.arc(this._screenX, this._screenY, this.limit / this.ring, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.restore();*/
    }
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed, ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        //keep size
        //地理坐标 转回 屏幕坐标
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        /*ctx.arc(this._screenX, this._screenY, this.limit / this.ring, 0, Math.PI * 2, true);
        ctx.fill();*/
        for (let i = 0; i < this.ring; i++) {
            ctx.beginPath(); //Start path
            ctx.arc(this._screenX, this._screenY, (elapsed / 1000 * this.velocity + i * this.limit / this.ring) % this.limit, 0, Math.PI * 2, true);
            //ctx.arc(this._screenX, this._screenY, this.limit / this.ring + ((elapsed/1000 + (this.limit - this.limit / this.ring) / this.velocity * (i/(this.ring - 1))) * this.velocity) % this.limit, 0, Math.PI * 2, true);
            ctx.stroke();
        }
        ctx.restore();
    }
}
/**
 * 线默认动画效果类
 * @remarks
 * 类似航线效果
 */
class LineAnimation extends Animation {
    /**
     * 创建动画效果
     * @param {Polyline} geometry - 线
     */
    constructor(geometry) {
        super();
        this._percent = 0;
        /**
         * 线宽
         */
        this.lineWidth = 2;
        /**
         * 起始色
         */
        this.startColor = "#ff0000";
        /**
         * 终止色
         */
        this.endColor = "#ffff00";
        /**
         * 二次贝塞尔曲线控制点与线段夹角
         */
        this.angle = Math.PI / 4;
        this._polyline = geometry;
    }
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"]()) {
        this._polyline.project(projection);
        const matrix = ctx.getTransform();
        this._screen = this._polyline.coordinates.map((point, index) => {
            const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
            return [screenX, screenY];
        });
        //TODO: polyline, not line; but now just line
        this._start = this._screen[0];
        this._end = this._screen[1];
        const k = (this._end[1] - this._start[1]) / (this._end[0] - this._start[0]);
        const d = Math.sqrt((this._end[1] - this._start[1]) * (this._end[1] - this._start[1]) + (this._end[0] - this._start[0]) * (this._end[0] - this._start[0]));
        const s = d / 2 / Math.cos(this.angle);
        //const a = (Math.atan(k) < 0 ? (Math.PI +  Math.atan(k)) : Math.atan(k)) - this.angle;
        //this._control = this._start[0] >= this._end[0] ? [this._start[0] + s * Math.cos(a), this._start[1] + s * Math.sin(a)] : [this._end[0] + s * Math.cos(a), this._end[1] + s * Math.sin(a)];
        const a = Math.atan(k) - this.angle;
        if (Math.atan(k) < 0) {
            if (this._end[0] > this._start[0]) {
                this._control = [this._start[0] + s * Math.cos(a), this._start[1] + s * Math.sin(a)];
            }
            else {
                this._control = [this._end[0] + s * Math.cos(a), this._end[1] + s * Math.sin(a)];
            }
        }
        else {
            if (this._end[0] > this._start[0]) {
                this._control = [this._start[0] + s * Math.cos(a), this._start[1] + s * Math.sin(a)];
            }
            else {
                this._control = [this._end[0] + s * Math.cos(a), this._end[1] + s * Math.sin(a)];
            }
        }
        this._percent = 0;
    }
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed, ctx) {
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        //keep size
        //地理坐标 转回 屏幕坐标
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const lineGradient = ctx.createLinearGradient(this._start[0], this._start[1], this._end[0], this._end[1]);
        lineGradient.addColorStop(0, this.startColor);
        // lineGradient.addColorStop(0.3, '#fff');
        lineGradient.addColorStop(1, this.endColor);
        ctx.strokeStyle = lineGradient; //设置线条样式
        this._drawCurvePath(ctx, this._start, this._control, this._end, this._percent);
        this._percent += 0.8; //进程增加,这个控制动画速度
        if (this._percent >= 100) { //没有画完接着调用,画完的话重置进度
            this._percent = 0;
        }
    }
    _drawCurvePath(ctx, start, point, end, percent) {
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        for (let t = 0; t <= percent / 100; t += 0.005) {
            let x = this._quadraticBezier(start[0], point[0], end[0], t);
            let y = this._quadraticBezier(start[1], point[1], end[1], t);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    _quadraticBezier(p0, p1, p2, t) {
        let k = 1 - t;
        return k * k * p0 + 2 * (1 - t) * t * p1 + t * t * p2; // 二次贝赛尔曲线方程
    }
}


/***/ }),

/***/ "../dist/animation/particle-animation.js":
/*!***********************************************!*\
  !*** ../dist/animation/particle-animation.js ***!
  \***********************************************/
/*! exports provided: ParticleAnimation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParticleAnimation", function() { return ParticleAnimation; });
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation */ "../dist/animation/animation.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");


/**
 * 星球或粒子类
 */
class Particle {
    constructor(radius, speed, color) {
        this.pos = Math.random() * 360;
        this.c = color;
        this.r = (Math.random() * radius / 10);
        this.R = radius;
        this.s = speed;
    }
}
/**
 * 轨道类
 */
class Orbit {
    constructor(radius, speed, color, count) {
        this.particles = [];
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        for (let index = 0; index < count; index++) {
            let s = Math.random() / 60 * this.speed;
            s = index % 2 ? s : s * -1;
            this.particles.push(new Particle(radius, s, color));
        }
    }
}
/**
 * 星球环绕动画效果类
 * @remarks
 * 轨道星球环绕动画效果
 */
class ParticleAnimation extends _animation__WEBPACK_IMPORTED_MODULE_0__["PointAnimation"] {
    constructor() {
        super(...arguments);
        /**
         * 轨道半径
         */
        this.radius = 20;
        /**
         * 环绕速度
         */
        this.speed = 10;
        /**
         * 颜色
         */
        this.color = "#E76B76";
        /**
         * 星球或粒子数
         */
        this.count = 40;
        /**
         * alpha通道
         */
        this.alpha = 0.5;
        /**
         * 颜色合成方式
         */
        this.composite = "soft-light";
    }
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"]()) {
        super.init(ctx, projection);
        this._orbit = new Orbit(this.radius, this.speed, this.color, this.count);
    }
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed, ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._orbit.particles.forEach(particle => {
            //绕圆形轨道，sin和cos来获得x和y的delta分量
            particle.x = this._screenX + particle.R * Math.sin(Math.PI / 2 + particle.pos);
            particle.y = this._screenY + particle.R * Math.cos(Math.PI / 2 + particle.pos);
            particle.pos += particle.s;
            ctx.beginPath();
            ctx.globalAlpha = this.alpha;
            ctx.globalCompositeOperation = this.composite;
            ctx.fillStyle = particle.c;
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        });
        ctx.restore();
    }
}


/***/ }),

/***/ "../dist/animator.js":
/*!***************************!*\
  !*** ../dist/animator.js ***!
  \***************************/
/*! exports provided: Animator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animator", function() { return Animator; });
/* harmony import */ var _util_subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/subject */ "../dist/util/subject.js");

/**
 * 动画效果的管理器
 * 已内置于map，可通过map的接口进行添加删除的维护操作
 */
class Animator extends _util_subject__WEBPACK_IMPORTED_MODULE_0__["Subject"] {
    /**
     * 创建Animator
     * 不应自主创建，map内部创建
     * @param {Map} map - 地图容器
     */
    constructor(map) {
        super(["mouseover", "mouseout"]); //when mouseover feature
        //图层列表
        //private _layers: FeatureLayer[] = [];
        this._animations = [];
        this._map = map;
        const container = map.container;
        //create canvas
        this._canvas = document.createElement("canvas");
        this._canvas.style.cssText = "position: absolute; height: 100%; width: 100%; z-index: 80";
        this._canvas.width = container.clientWidth;
        this._canvas.height = container.clientHeight;
        container.appendChild(this._canvas);
        this._onResize = this._onResize.bind(this);
        this._extentChange = this._extentChange.bind(this);
        this._ctx = this._canvas.getContext("2d");
        this._map.on("resize", this._onResize);
        this._map.on("extent", this._extentChange);
    }
    //与主视图同步
    _onResize(event) {
        this._canvas.width = this._map.container.clientWidth;
        this._canvas.height = this._map.container.clientHeight;
    }
    //与主视图同步
    _extentChange(event) {
        //const matrix = DOMMatrix.fromFloat64Array( new Float64Array([event.matrix.a, 0, 0, event.matrix.d, event.matrix.e, event.matrix.f] ) );
        //this._ctx.setTransform(matrix);
        this._ctx.setTransform(event.matrix.a, 0, 0, event.matrix.d, event.matrix.e, event.matrix.f);
        this.redraw();
    }
    /**
     * 添加动画
     * @param {Animation} animation - 动画
     */
    addAnimation(animation) {
        this._animations.push(animation);
        this.redraw();
    }
    /**
     * 删除动画
     * @param {Animation} animation - 动画
     */
    removeAnimation(animation) {
        const index = this._animations.findIndex(item => item === animation);
        index != -1 && this._animations.splice(index, 1);
        this.redraw();
    }
    /**
     * 清除动画
     */
    clearAnimations() {
        this._animations = [];
        this.redraw();
    }
    /**
     * 重绘
     */
    redraw() {
        this._frame && window.cancelAnimationFrame(this._frame);
        this._start = undefined;
        this._ctx.save();
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
        //动画初始化
        this._animations.forEach(animation => {
            animation.init(this._ctx, this._map.projection);
        });
        //this上下文绑定
        this.animate = this.animate.bind(this);
        //动画循环
        this._frame = window.requestAnimationFrame(this.animate);
    }
    /**
     * 动画循环
     * @param {number} timestamp - 时间戳
     */
    animate(timestamp) {
        if (this._start === undefined) {
            this._start = timestamp;
        }
        //计算逝去时间，毫秒
        const elapsed = timestamp - this._start;
        this._ctx.save();
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
        //遍历所以动画效果，执行动画
        this._animations.forEach(animation => {
            animation.animate(elapsed, this._ctx);
        });
        //循环，下一帧
        this._frame = window.requestAnimationFrame(this.animate);
    }
    /**
     * 清空画布
     */
    clear() {
        this._ctx.save();
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
    }
    /**
     * 销毁
     */
    destroy() {
        this._map.off("resize", this._onResize);
        this._map.off("extent", this._extentChange);
        this._frame && window.cancelAnimationFrame(this._frame);
    }
}


/***/ }),

/***/ "../dist/data/feature-class.js":
/*!*************************************!*\
  !*** ../dist/data/feature-class.js ***!
  \*************************************/
/*! exports provided: FeatureClass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureClass", function() { return FeatureClass; });
/* harmony import */ var _element_feature__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element/feature */ "../dist/element/feature.js");
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _geometry_point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../geometry/point */ "../dist/geometry/point.js");
/* harmony import */ var _geometry_polyline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../geometry/polyline */ "../dist/geometry/polyline.js");
/* harmony import */ var _geometry_polygon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../geometry/polygon */ "../dist/geometry/polygon.js");





/**
 * 要素类（要素集合）
 * @remarks
 * TODO: a lot of things to be done
 */
class FeatureClass {
    /**
     * 创建要素集合
     * @param {GeometryType} type - 空间数据类型：点/线/面
     */
    constructor(type) {
        /**
         * 属性字段集合
         */
        this._fields = [];
        /**
         * 要素集合
         */
        this._features = [];
        this._type = type;
    }
    /**
     * 空间数据类型：点/线/面
     */
    get type() {
        return this._type;
    }
    /**
     * 要素集合
     */
    get features() {
        return this._features;
    }
    /**
     * 属性字段集合
     */
    get fields() {
        return this._fields;
    }
    /**
     * 添加要素
     * @param {Feature} feature - 空间矢量要素
     */
    addFeature(feature) {
        this._features.push(feature);
    }
    /**
     * 删除要素
     * @param {Feature} feature - 空间矢量要素
     */
    removeFeature(feature) {
        const index = this._features.findIndex(item => item === feature);
        index != -1 && this._features.splice(index, 1);
    }
    /**
     * 清空要素集合
     */
    clearFeatures() {
        this._features = [];
    }
    /**
     * 添加字段
     * @param {Field} field - 字段
     */
    addField(field) {
        this._fields.push(field);
    }
    /**
    * 删除字段
    * @param {Field} field - 字段
    */
    removeField(field) {
        const index = this._fields.findIndex(item => item === field);
        index != -1 && this._fields.splice(index, 1);
    }
    /**
    * 清空字段集合
    */
    clearFields() {
        this._fields = [];
    }
    /**
     * 加载GeoJSON数据格式
     * @remarks
     * TODO: multiple point line polygon is not supported
     * @param {Object} data - GeoJSON数据
     */
    loadGeoJSON(data) {
        Array.isArray(data.features) && data.features.forEach(item => {
            switch (item.geometry.type) {
                case "Point":
                    //TODO: each feature has one type that is ridiculous, cause geojson is a featurecollection, not a featurelayer.
                    this._type = _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Point;
                    const point = new _geometry_point__WEBPACK_IMPORTED_MODULE_2__["Point"](item.geometry.coordinates[0], item.geometry.coordinates[1]);
                    this._features.push(new _element_feature__WEBPACK_IMPORTED_MODULE_0__["Feature"](point, item.properties));
                    break;
                case "LineString":
                    this._type = _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Polyline;
                    const polyline = new _geometry_polyline__WEBPACK_IMPORTED_MODULE_3__["Polyline"](item.geometry.coordinates);
                    this._features.push(new _element_feature__WEBPACK_IMPORTED_MODULE_0__["Feature"](polyline, item.properties));
                    break;
                case "Polygon":
                    this._type = _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Polygon;
                    const polygon = new _geometry_polygon__WEBPACK_IMPORTED_MODULE_4__["Polygon"](item.geometry.coordinates);
                    this._features.push(new _element_feature__WEBPACK_IMPORTED_MODULE_0__["Feature"](polygon, item.properties));
                    break;
            }
        });
    }
}


/***/ }),

/***/ "../dist/data/field.js":
/*!*****************************!*\
  !*** ../dist/data/field.js ***!
  \*****************************/
/*! exports provided: FieldType, Field */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FieldType", function() { return FieldType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Field", function() { return Field; });
/**
 * 字段类型
 */
var FieldType;
(function (FieldType) {
    /**
     * 字符串
     */
    FieldType[FieldType["String"] = 1] = "String";
    /**
     * 数值型
     */
    FieldType[FieldType["Number"] = 2] = "Number";
})(FieldType || (FieldType = {}));
/**
 * 字段
 * @remarks
 * TODO: a lot of things to be done
 */
class Field {
}


/***/ }),

/***/ "../dist/element/feature.js":
/*!**********************************!*\
  !*** ../dist/element/feature.js ***!
  \**********************************/
/*! exports provided: Feature */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Feature", function() { return Feature; });
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony import */ var _util_subject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/subject */ "../dist/util/subject.js");



/**
 * 矢量要素
 * <p>
 * Graphic vs Feature：Graphic作为图形，可以一图形对应一渲染符号；而Feature作为矢量要素，常规应该根据图层设定的渲染方式Renderer来得到各个Feature的渲染符号，而非单一设置。<br/>
 * Graphic = Geometry + Symbol<br/>
 * Feature = Geometry + Properties<br/>
 * ArcGIS AO/AE: Feature = Geometry + Properties<br/>
 * ArcGIS JS API: Feature = Graphic = Geometry + Properties + Symbol<br/>
 * </p>
 */
class Feature extends _util_subject__WEBPACK_IMPORTED_MODULE_2__["Subject"] {
    /**
     * 创建矢量要素
     * @param {Geometry} geometry - 空间图形
     * @param {Object} properties - 属性信息
     * @param {Symbol} symbol - 渲染符号
     */
    constructor(geometry, properties, symbol) {
        //该对象可订阅如下事件
        super(["click", "dblclick", "mouseover", "mouseout"]);
        /**
         * 是否可见
         */
        this.visible = true;
        this._geometry = geometry;
        this._properties = properties;
        this._symbol = symbol;
    }
    //****************重要说明***************
    //有关 getter setter
    //1.如按原先代码规则，private _variable  
    //  只做为类内部函数服务：no getter no setter
    //  只读：getter no setter
    //  读写：getter + setter
    //2.后经 public 的定义扩展，可得到：
    //  public = private + getter + setter
    //  另：public 可省略
    //注：两种规则无差别，按习惯编写。
    /**
     * 渲染符号
     * <p>
     * 此处两个符号，本应不存在：
     * Graphic vs Feature：Graphic作为图形，可以一图形对应一渲染符号；而Feature作为矢量要素，常规应该根据图层设定的渲染方式Renderer来得到各个Feature的渲染符号，而非单一设置。
     * 此处加入的原因如下：
     * 由于一些特例需求的存在，例如要素被选中状态，要素需要高亮符号等等，因此该符号独立于图层的渲染方式，原本针对这些特例会做一些专门的解决模式（可参考ArcGIS，设定图层专有的选中符号），
     * 但此处为方便起见，暂保留该设置。
     * </p>
     * @type {Symbol}
     */
    get symbol() {
        return this._symbol;
    }
    set symbol(value) {
        this._symbol = value;
    }
    /**
     * 空间图形
     * @type {Geometry}
     * @readonly
     */
    get geometry() {
        return this._geometry;
    }
    /**
     * 属性信息
     * @type {Object}
     * @readonly
     */
    get properties() {
        return this._properties;
    }
    /**
     * 标注符号
     * <p>
     * 参考渲染符号说明
     * </p>
     * @type {SimpleTextSymbol}
     */
    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
    }
    /**
     * 绘制要素
     * 调用空间坐标信息进行图形绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号，一般来自于renderer
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimplePointSymbol"]()) {
        if (this.visible)
            this._geometry.draw(ctx, projection, extent, (this._symbol || symbol));
    }
    /**
     * 判断是否在可视范围内
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @return {boolean} 是否在可视范围内
     */
    intersect(projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound) {
        if (this.visible)
            return this._geometry.intersect(projection, extent);
    }
    /**
     * 标注要素
     * 调用空间坐标信息进行标注绘制
     * @param {Field} field - 标注字段
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {SimpleTextSymbol} symbol - 标注符号
     */
    label(field, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimpleTextSymbol"]()) {
        if (this.visible)
            this._geometry.label(this._properties[field.name], ctx, projection, this._text || symbol);
    }
    /**
     * 交互判断
     * 鼠标坐标是否落入要素
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenY - 鼠标屏幕坐标Y
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY, event = undefined) {
        if (this.visible) {
            const flag = this._geometry.contain(screenX, screenY);
            if (event == "mousemove") {
                if (!this._contained && flag) {
                    //如果鼠标当前不在要素内，同时鼠标进入到要素内
                    this.emit("mouseover", { feature: this, screenX: screenX, screenY: screenY });
                }
                else if (this._contained && !flag) {
                    //如果鼠标当前在要素内，同时鼠标移出到要素外
                    this.emit("mouseout", { feature: this, screenX: screenX, screenY: screenY });
                }
            }
            this._contained = flag;
            return flag;
        }
    }
}


/***/ }),

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
/* harmony import */ var _util_subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/subject */ "../dist/util/subject.js");


/**
 * 图形要素
 * 区别与Feature，单纯的图形
 */
class Graphic extends _util_subject__WEBPACK_IMPORTED_MODULE_1__["Subject"] {
    /**
     * 创建图形要素
     * @param {Geometry} geometry - 空间图形
     * @param {Symbol} symbol - 渲染符号
     */
    constructor(geometry, symbol) {
        //该对象可订阅如下事件
        super(["click", "dblclick", "mouseover", "mouseout"]);
        /**
         * 是否可见
         */
        this.visible = true;
        this._geometry = geometry;
        this._symbol = symbol;
    }
    /**
     * 绘制图形
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"](), extent = projection.bound) {
        if (this.visible)
            this._geometry.draw(ctx, projection, extent, this._symbol);
    }
    /**
     * 判断是否在可视范围内
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @return {boolean} 是否在可视范围内
     */
    intersect(projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"](), extent = projection.bound) {
        if (this.visible)
            return this._geometry.intersect(projection, extent);
    }
    /**
     * 交互判断
     * 鼠标坐标是否落入图形
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenY - 鼠标屏幕坐标Y
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY, event = undefined) {
        if (this.visible) {
            const flag = this._geometry.contain(screenX, screenY);
            if (event == "mousemove") {
                if (!this._contained && flag) {
                    //如果鼠标当前不在图形内，同时鼠标进入到图形内
                    this.emit("mouseover", { feature: this, screenX: screenX, screenY: screenY });
                }
                else if (this._contained && !flag) {
                    //如果鼠标当前在图形内，同时鼠标移出到图形外
                    this.emit("mouseout", { feature: this, screenX: screenX, screenY: screenY });
                }
            }
            this._contained = flag;
            return flag;
        }
    }
}


/***/ }),

/***/ "../dist/element/raster.js":
/*!*********************************!*\
  !*** ../dist/element/raster.js ***!
  \*********************************/
/*! exports provided: Raster */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Raster", function() { return Raster; });
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");


/*
 * 栅格
 */
class Raster {
    /**
     * 创建栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {number} xmin - 经度左值
     * @param {number} ymin - 纬度下值
     * @param {number} xmax - 经度右值
     * @param {number} ymax - 纬度上值
     * @param {number} width - 栅格宽度
     * @param {number} height - 栅格高度
     * @param {number} cellsize - 栅格大小
     */
    constructor(xmin, ymin, xmax, ymax, width = 1000, height = 1000) {
        this._canvas = document.createElement("canvas");
        this._canvas.width = width;
        this._canvas.height = height;
        this._bound = new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](xmin, ymin, xmax, ymax);
    }
    /*
     * 动态栅格（实时渲染）
     */
    get dynamic() {
        return false;
    }
    /*
     * 画布存放Image
     */
    get canvas() {
        return this._canvas;
    }
    /*
     * 栅格经纬度边界
     */
    get bound() {
        return this._bound;
    }
    /**
     * 绘制栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10) {
    }
}


/***/ }),

/***/ "../dist/geometry/geometry.js":
/*!************************************!*\
  !*** ../dist/geometry/geometry.js ***!
  \************************************/
/*! exports provided: CoordinateType, GeometryType, Geometry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoordinateType", function() { return CoordinateType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GeometryType", function() { return GeometryType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return Geometry; });
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");



/**
 * 坐标类型
 * @enum {number}
 */
var CoordinateType;
(function (CoordinateType) {
    /**
     * 经纬度坐标
     */
    CoordinateType[CoordinateType["Latlng"] = 1] = "Latlng";
    /**
     * 地理平面坐标
     */
    CoordinateType[CoordinateType["Projection"] = 2] = "Projection";
    /**
     * 屏幕平面坐标
     */
    CoordinateType[CoordinateType["Screen"] = 3] = "Screen";
})(CoordinateType || (CoordinateType = {}));
/**
 * 图形类型
 * @enum {number}
 */
var GeometryType;
(function (GeometryType) {
    /**
     * 点
     */
    GeometryType[GeometryType["Point"] = 1] = "Point";
    /**
     * 线
     */
    GeometryType[GeometryType["Polyline"] = 2] = "Polyline";
    /**
     * 面
     */
    GeometryType[GeometryType["Polygon"] = 3] = "Polygon";
})(GeometryType || (GeometryType = {}));
/**
 * 图形基类
 */
class Geometry {
    /**
     * 投影变换虚函数
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection) { }
    ;
    /**
     * 图形绘制虚函数
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_1__["SimplePointSymbol"]()) { }
    ;
    /**
     * 图形包络矩形与可见视图范围是否包含或相交
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @return {boolean} 是否在可视范围内
     */
    intersect(projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"](), extent = projection.bound) {
        if (!this._projected)
            this.project(projection);
        return extent.intersect(this._bound);
    }
    /**
     * 获取图形中心点虚函数
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type = CoordinateType.Latlng, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"]()) { }
    ;
    /**
     * 获取两个图形间距离
     * @remarks
     * 当前为两图形中心点间的直线距离
     * 多用于聚合判断
     * @param {Geometry} geometry - 另一图形
     * @param {CoordinateType} type - 坐标类型
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {number} 距离
     */
    distance(geometry, type, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"]()) {
        const center = this.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        const point = geometry.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        if (type == CoordinateType.Screen) {
            const matrix = ctx.getTransform();
            const screenX1 = (matrix.a * center[0] + matrix.e), screenY1 = (matrix.d * center[1] + matrix.f);
            const screenX2 = (matrix.a * point[0] + matrix.e), screenY2 = (matrix.d * point[1] + matrix.f);
            return Math.sqrt((screenX2 - screenX1) * (screenX2 - screenX1) + (screenY2 - screenY1) * (screenY2 - screenY1));
        }
        else if (type == CoordinateType.Projection) {
            return Math.sqrt((point[0] - center[0]) * (point[0] - center[0]) + (point[1] - center[1]) * (point[1] - center[1]));
        }
    }
    /**
     * 标注绘制
     * @remarks
     * 标注文本支持多行，/r/n换行
     * @param {string} text - 标注文本
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {SimpleTextSymbol} symbol - 标注符号
     */
    label(text, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"](), symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_1__["SimpleTextSymbol"]()) {
        if (!text)
            return;
        if (!this._projected)
            this.project(projection);
        ctx.save();
        ctx.strokeStyle = symbol.strokeStyle;
        ctx.fillStyle = symbol.fillStyle;
        ctx.lineWidth = symbol.lineWidth;
        ctx.lineJoin = "round";
        ctx.font = symbol.fontSize + "px/1 " + symbol.fontFamily + " " + symbol.fontWeight;
        const center = this.getCenter(CoordinateType.Projection, projection);
        const matrix = ctx.getTransform();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //标注文本多行分割
        const array = text.split("/r/n");
        //计算每一行宽度
        let widths = array.map(str => ctx.measureText(str).width + symbol.padding * 2);
        //取最大宽度，作为标注宽度
        let width = Math.max(...widths);
        //高度取决于：字体大小，以及行数*行距，以及标注框上下的留白padding
        let height = symbol.fontSize * array.length + symbol.padding * 2 + symbol.padding * (array.length - 1);
        const screenX = (matrix.a * center[0] + matrix.e);
        const screenY = (matrix.d * center[1] + matrix.f);
        //画标注外框
        ctx.strokeRect(screenX + symbol.offsetX - symbol.padding, screenY + symbol.offsetY - symbol.padding, width, height);
        //填充标注背景
        ctx.fillRect(screenX + symbol.offsetX - symbol.padding, screenY + symbol.offsetY - symbol.padding, width, height);
        ctx.textBaseline = "top";
        ctx.fillStyle = symbol.fontColor;
        //多行文本绘制
        array.forEach((str, index) => {
            ctx.fillText(str, screenX + symbol.offsetX + (width - widths[index]) / 2, screenY + symbol.offsetY + index * (symbol.fontSize + symbol.padding));
        });
        ctx.restore();
    }
    ;
    /**
     * 标注量算
     * @remarks
     * 标注文本支持多行，/r/n换行
     * 目前用于寻找自动标注最合适的方位：top bottom left right
     * @param {string} text - 标注文本
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {SimpleTextSymbol} symbol - 标注符号
     */
    measure(text, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"](), symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_1__["SimpleTextSymbol"]()) {
        if (!text)
            return;
        ctx.save();
        ctx.font = symbol.fontSize + "px/1 " + symbol.fontFamily + " " + symbol.fontWeight;
        const center = this.getCenter(CoordinateType.Projection, projection);
        const matrix = ctx.getTransform();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //标注文本多行分割
        const array = text.split("/r/n");
        //计算每一行宽度
        let widths = array.map(str => ctx.measureText(str).width + symbol.padding * 2);
        //取最大宽度，作为标注宽度
        let width = Math.max(...widths);
        //高度取决于：字体大小，以及行数*行距，以及标注框上下的留白padding
        let height = symbol.fontSize * array.length + symbol.padding * 2 + symbol.padding * (array.length - 1);
        const screenX = (matrix.a * center[0] + matrix.e);
        const screenY = (matrix.d * center[1] + matrix.f);
        ctx.restore();
        return new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](screenX + symbol.offsetX - symbol.padding, screenY + symbol.offsetY - symbol.padding, screenX + symbol.offsetX - symbol.padding + width, screenY + symbol.offsetY - symbol.padding + height);
    }
    ;
    /**
     * 是否包含传入坐标
     * @remarks 主要用于鼠标交互
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY) { return false; }
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




/**
 * 点
 */
class Point extends _geometry__WEBPACK_IMPORTED_MODULE_0__["Geometry"] {
    /**
     * 创建点
     * @param {number} lng - 经度
     * @param {number} lat - 纬度
     */
    constructor(lng, lat) {
        super();
        this._lng = lng;
        this._lat = lat;
    }
    /**
     * 经纬度-经度
     */
    get lng() {
        return this._lng;
    }
    /**
     * 经纬度-纬度
     */
    get lat() {
        return this._lat;
    }
    /**
     * 平面坐标-X
     */
    get x() {
        return this._x;
    }
    /**
     * 平面坐标-Y
     */
    get y() {
        return this._y;
    }
    ;
    /**
     * 投影变换
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection) {
        this._projection = projection;
        //经纬度转平面坐标
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance.
        //包络矩形，当前是点，可考虑加入buffer或tolerance
        this._bound = new _util_bound__WEBPACK_IMPORTED_MODULE_1__["Bound"](this._x, this._y, this._x, this._y);
        this._projected = true;
    }
    /**
     * 绘制点
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimplePointSymbol"]()) {
        return __awaiter(this, void 0, void 0, function* () {
            //如第一次绘制，没有经过投影，则先完成投影，以后可跳过
            if (!this._projected)
                this.project(projection);
            //再判断是否在可视范围内
            if (!extent.intersect(this._bound))
                return;
            //获得屏幕坐标，以便根据symbol来进行绘制
            //TODO: cache screenXY & symbol for redraw.
            const matrix = ctx.getTransform();
            this._screenX = (matrix.a * this._x + matrix.e);
            this._screenY = (matrix.d * this._y + matrix.f);
            this._symbol = symbol;
            this._symbol.draw(ctx, this._screenX, this._screenY);
        });
    }
    ;
    /**
     * 获取中心点
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type = _geometry__WEBPACK_IMPORTED_MODULE_0__["CoordinateType"].Latlng, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"]()) {
        if (!this._projected)
            this.project(projection);
        if (type === _geometry__WEBPACK_IMPORTED_MODULE_0__["CoordinateType"].Latlng) {
            return [this._lng, this._lat];
        }
        else {
            return [this._x, this._y];
        }
    }
    /**
     * 是否包含传入坐标
     * @remarks
     * 由于点是0维，主要根据渲染的符号大小来判断传入坐标是否落到点内
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY) {
        return this._symbol ? this._symbol.contain(this._screenX, this._screenY, screenX, screenY) : false;
    }
}


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




/**
 * 面
 * @remarks
 * 数据结构：[ring[point[x,y]]]：such as [[[1,1],[2,2],[1,2]], [[1.5,1.5],[1.9,1.9],[1.5,1.9]]]
 */
class Polygon extends _geometry__WEBPACK_IMPORTED_MODULE_0__["Geometry"] {
    /**
     * 创建面
     * @param {number[][][]} lnglats - 坐标集合，三维数组
     */
    constructor(lnglats) {
        super();
        this._lnglats = lnglats;
    }
    /**
     * 经纬度
     */
    get lnglats() {
        return this._lnglats;
    }
    /**
     * 平面坐标
     */
    get coordinates() {
        return this._coordinates;
    }
    ;
    /**
     * 投影变换
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection) {
        this._projection = projection;
        //经纬度转平面坐标
        this._coordinates = this._lnglats.map((ring) => ring.map((point) => this._projection.project(point)));
        //提取包络矩形
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
    /**
     * 绘制面
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimpleFillSymbol"]()) {
        //如第一次绘制，没有经过投影，则先完成投影，以后可跳过
        if (!this._projected)
            this.project(projection);
        //再判断是否在可视范围内
        if (!extent.intersect(this._bound))
            return;
        const matrix = ctx.getTransform();
        this._screen = this._coordinates.map(ring => {
            return ring.map((point, index) => {
                const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
                return [screenX, screenY];
            });
        });
        //TODO: cache screenXY & symbol for redraw.
        symbol.draw(ctx, this._screen);
    }
    /**
     * 获取面的中心点
     * @remarks
     * from Leaflet
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type = _geometry__WEBPACK_IMPORTED_MODULE_0__["CoordinateType"].Latlng, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"]()) {
        if (!this._projected)
            this.project(projection);
        let i, j, p1, p2, f, area, x, y, center, points = this._coordinates[0], len = points.length;
        if (!len) {
            return null;
        }
        // polygon centroid algorithm; only uses the first ring if there are multiple
        area = x = y = 0;
        for (i = 0, j = len - 1; i < len; j = i++) {
            p1 = points[i];
            p2 = points[j];
            f = p1[1] * p2[0] - p2[1] * p1[0];
            x += (p1[0] + p2[0]) * f;
            y += (p1[1] + p2[1]) * f;
            area += f * 3;
        }
        if (area === 0) {
            // Polygon is so small that all points are on same pixel.
            center = points[0];
        }
        else {
            center = [x / area, y / area];
        }
        if (type === _geometry__WEBPACK_IMPORTED_MODULE_0__["CoordinateType"].Latlng) {
            return projection.unproject(center);
        }
        else {
            return center;
        }
    }
    /**
     * 是否包含传入坐标
     * @remarks
     * 点是不是落在面内
     * from https://github.com/substack/point-in-polygon
     * ray-casting algorithm based on
     * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY) {
        const first = this._screen[0];
        const others = this._screen.slice(1);
        //first ring contained && others no contained
        const _pointInPolygon = (point, vs) => {
            let x = point[0], y = point[1];
            let inside = false;
            for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                let xi = vs[i][0], yi = vs[i][1];
                let xj = vs[j][0], yj = vs[j][1];
                let intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect)
                    inside = !inside;
            }
            return inside;
        };
        return _pointInPolygon([screenX, screenY], first) && others.every(ring => !_pointInPolygon([screenX, screenY], ring));
        //return this._screen.some(ring => this._pointInPolygon([screenX, screenY], ring));
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




/**
 * 线
 * @remarks
 * 数据结构：such as [[1,1],[2,2],[1,2]]
 */
class Polyline extends _geometry__WEBPACK_IMPORTED_MODULE_0__["Geometry"] {
    /**
     * 创建线
     * @param {number[][]} lnglats - 坐标集合，二维数组
     */
    constructor(lnglats) {
        super();
        /**
         * 交互鼠标坐标到线垂直距离的可选范围
         * @remarks
         * 可选范围 = 容差 + 线宽
         * TOLERANCE + symbol.lineWidth
         */
        this._tolerance = 4;
        this._lnglats = lnglats;
    }
    /**
     * 经纬度
     */
    get lnglats() {
        return this._lnglats;
    }
    /**
     * 平面坐标
     */
    get coordinates() {
        return this._coordinates;
    }
    ;
    /**
     * 投影变换
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection) {
        this._projection = projection;
        //经纬度转平面坐标
        this._coordinates = this._lnglats.map((point) => this._projection.project(point));
        //提取包络矩形
        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach(point => {
            xmin = Math.min(xmin, point[0]);
            ymin = Math.min(ymin, point[1]);
            xmax = Math.max(xmax, point[0]);
            ymax = Math.max(ymax, point[1]);
        });
        this._bound = new _util_bound__WEBPACK_IMPORTED_MODULE_1__["Bound"](xmin, ymin, xmax, ymax);
    }
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"](), extent = projection.bound, symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_2__["SimpleLineSymbol"]()) {
        //如第一次绘制，没有经过投影，则先完成投影，以后可跳过
        if (!this._projected)
            this.project(projection);
        //再判断是否在可视范围内
        if (!extent.intersect(this._bound))
            return;
        this._tolerance = Polyline.TOLERANCE + symbol.lineWidth;
        const matrix = ctx.getTransform();
        this._screen = this._coordinates.map((point, index) => {
            const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
            return [screenX, screenY];
        });
        //TODO: cache screenXY & symbol for redraw.
        symbol.draw(ctx, this._screen);
    }
    /**
     * 获取线的中心点
     * @remarks
     * from Leaflet
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type = _geometry__WEBPACK_IMPORTED_MODULE_0__["CoordinateType"].Latlng, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_3__["WebMercator"]()) {
        if (!this._projected)
            this.project(projection);
        let i, halfDist, segDist, dist, p1, p2, ratio, points = this._coordinates, len = points.length;
        if (!len) {
            return null;
        }
        // polyline centroid algorithm; only uses the first ring if there are multiple
        for (i = 0, halfDist = 0; i < len - 1; i++) {
            halfDist += Math.sqrt((points[i + 1][0] - points[i][0]) * (points[i + 1][0] - points[i][0]) + (points[i + 1][1] - points[i][1]) * (points[i + 1][1] - points[i][1])) / 2;
        }
        let center;
        // The line is so small in the current view that all points are on the same pixel.
        if (halfDist === 0) {
            center = points[0];
        }
        for (i = 0, dist = 0; i < len - 1; i++) {
            p1 = points[i];
            p2 = points[i + 1];
            segDist = Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
            dist += segDist;
            if (dist > halfDist) {
                ratio = (dist - halfDist) / segDist;
                center = [
                    p2[0] - ratio * (p2[0] - p1[0]),
                    p2[1] - ratio * (p2[1] - p1[1])
                ];
            }
        }
        if (type === _geometry__WEBPACK_IMPORTED_MODULE_0__["CoordinateType"].Latlng) {
            return projection.unproject(center);
        }
        else {
            return center;
        }
    }
    /**
     * 是否包含传入坐标
     * @remarks
     * 线是1维，所以要设置一个tolerance容差，来判断坐标是否落到线上
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY) {
        let p2;
        //from Leaflet
        //点到线段的距离，垂直距离
        const _distanceToSegment = (p, p1, p2) => {
            let x = p1[0], y = p1[1], dx = p2[0] - x, dy = p2[1] - y, dot = dx * dx + dy * dy, t;
            if (dot > 0) {
                t = ((p[0] - x) * dx + (p[1] - y) * dy) / dot;
                if (t > 1) {
                    x = p2[0];
                    y = p2[1];
                }
                else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }
            dx = p[0] - x;
            dy = p[1] - y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        const distance = this._screen.reduce((acc, cur) => {
            if (p2) {
                const p1 = p2;
                p2 = cur;
                return Math.min(acc, _distanceToSegment([screenX, screenY], p1, p2));
            }
            else {
                p2 = cur;
                return acc;
            }
        }, Number.MAX_VALUE);
        return distance <= this._tolerance;
    }
}
/**
 * 容差
 * @remarks
 * 用于交互（线宽较小的情况下，难以选中）
 * screen pixel
 */
Polyline.TOLERANCE = 4;


/***/ }),

/***/ "../dist/index.js":
/*!************************!*\
  !*** ../dist/index.js ***!
  \************************/
/*! exports provided: Map, FeatureClass, FieldType, Field, Graphic, Feature, CoordinateType, GeometryType, Geometry, Point, Polyline, Polygon, Collision, NullCollision, SimpleCollision, CoverCollision, Label, Layer, GraphicLayer, FeatureLayer, LatLngType, Projection, WebMercator, BD09, GCJ02, Symbol, PointSymbol, LineSymbol, FillSymbol, SimplePointSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, SimpleTextSymbol, ClusterSymbol, LetterSymbol, ArrowSymbol, Renderer, SimpleRenderer, CategoryRendererItem, CategoryRenderer, ClassRendererItem, ClassRenderer, Bound, Color, Subject, Animation, PointAnimation, LineAnimation, ParticleAnimation, Raster, RasterLayer, Kriging, Heat, InverseDistanceWeight, Tile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map */ "../dist/map.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Map", function() { return _map__WEBPACK_IMPORTED_MODULE_0__["Map"]; });

/* harmony import */ var _data_feature_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data/feature-class */ "../dist/data/feature-class.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FeatureClass", function() { return _data_feature_class__WEBPACK_IMPORTED_MODULE_1__["FeatureClass"]; });

/* harmony import */ var _data_field__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./data/field */ "../dist/data/field.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FieldType", function() { return _data_field__WEBPACK_IMPORTED_MODULE_2__["FieldType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Field", function() { return _data_field__WEBPACK_IMPORTED_MODULE_2__["Field"]; });

/* harmony import */ var _element_graphic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./element/graphic */ "../dist/element/graphic.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Graphic", function() { return _element_graphic__WEBPACK_IMPORTED_MODULE_3__["Graphic"]; });

/* harmony import */ var _element_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./element/feature */ "../dist/element/feature.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Feature", function() { return _element_feature__WEBPACK_IMPORTED_MODULE_4__["Feature"]; });

/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CoordinateType", function() { return _geometry_geometry__WEBPACK_IMPORTED_MODULE_5__["CoordinateType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GeometryType", function() { return _geometry_geometry__WEBPACK_IMPORTED_MODULE_5__["GeometryType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return _geometry_geometry__WEBPACK_IMPORTED_MODULE_5__["Geometry"]; });

/* harmony import */ var _geometry_point__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./geometry/point */ "../dist/geometry/point.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return _geometry_point__WEBPACK_IMPORTED_MODULE_6__["Point"]; });

/* harmony import */ var _geometry_polyline__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./geometry/polyline */ "../dist/geometry/polyline.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Polyline", function() { return _geometry_polyline__WEBPACK_IMPORTED_MODULE_7__["Polyline"]; });

/* harmony import */ var _geometry_polygon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./geometry/polygon */ "../dist/geometry/polygon.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Polygon", function() { return _geometry_polygon__WEBPACK_IMPORTED_MODULE_8__["Polygon"]; });

/* harmony import */ var _label_collision__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./label/collision */ "../dist/label/collision.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Collision", function() { return _label_collision__WEBPACK_IMPORTED_MODULE_9__["Collision"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NullCollision", function() { return _label_collision__WEBPACK_IMPORTED_MODULE_9__["NullCollision"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleCollision", function() { return _label_collision__WEBPACK_IMPORTED_MODULE_9__["SimpleCollision"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CoverCollision", function() { return _label_collision__WEBPACK_IMPORTED_MODULE_9__["CoverCollision"]; });

/* harmony import */ var _label_label__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./label/label */ "../dist/label/label.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Label", function() { return _label_label__WEBPACK_IMPORTED_MODULE_10__["Label"]; });

/* harmony import */ var _layer_layer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./layer/layer */ "../dist/layer/layer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Layer", function() { return _layer_layer__WEBPACK_IMPORTED_MODULE_11__["Layer"]; });

/* harmony import */ var _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./layer/graphic-layer */ "../dist/layer/graphic-layer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GraphicLayer", function() { return _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_12__["GraphicLayer"]; });

/* harmony import */ var _layer_feature_layer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./layer/feature-layer */ "../dist/layer/feature-layer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FeatureLayer", function() { return _layer_feature_layer__WEBPACK_IMPORTED_MODULE_13__["FeatureLayer"]; });

/* harmony import */ var _projection_projection__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./projection/projection */ "../dist/projection/projection.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LatLngType", function() { return _projection_projection__WEBPACK_IMPORTED_MODULE_14__["LatLngType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Projection", function() { return _projection_projection__WEBPACK_IMPORTED_MODULE_14__["Projection"]; });

/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebMercator", function() { return _projection_web_mercator__WEBPACK_IMPORTED_MODULE_15__["WebMercator"]; });

/* harmony import */ var _projection_bd09__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./projection/bd09 */ "../dist/projection/bd09.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BD09", function() { return _projection_bd09__WEBPACK_IMPORTED_MODULE_16__["BD09"]; });

/* harmony import */ var _projection_gcj02__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./projection/gcj02 */ "../dist/projection/gcj02.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GCJ02", function() { return _projection_gcj02__WEBPACK_IMPORTED_MODULE_17__["GCJ02"]; });

/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Symbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["Symbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PointSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["PointSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LineSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["LineSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FillSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["FillSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimplePointSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["SimplePointSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleLineSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["SimpleLineSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleFillSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["SimpleFillSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleMarkerSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["SimpleMarkerSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleTextSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["SimpleTextSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClusterSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["ClusterSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LetterSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["LetterSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ArrowSymbol", function() { return _symbol_symbol__WEBPACK_IMPORTED_MODULE_18__["ArrowSymbol"]; });

/* harmony import */ var _renderer_renderer__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./renderer/renderer */ "../dist/renderer/renderer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Renderer", function() { return _renderer_renderer__WEBPACK_IMPORTED_MODULE_19__["Renderer"]; });

/* harmony import */ var _renderer_simple_renderer__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./renderer/simple-renderer */ "../dist/renderer/simple-renderer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SimpleRenderer", function() { return _renderer_simple_renderer__WEBPACK_IMPORTED_MODULE_20__["SimpleRenderer"]; });

/* harmony import */ var _renderer_category_renderer__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./renderer/category-renderer */ "../dist/renderer/category-renderer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CategoryRendererItem", function() { return _renderer_category_renderer__WEBPACK_IMPORTED_MODULE_21__["CategoryRendererItem"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CategoryRenderer", function() { return _renderer_category_renderer__WEBPACK_IMPORTED_MODULE_21__["CategoryRenderer"]; });

/* harmony import */ var _renderer_class_renderer__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./renderer/class-renderer */ "../dist/renderer/class-renderer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClassRendererItem", function() { return _renderer_class_renderer__WEBPACK_IMPORTED_MODULE_22__["ClassRendererItem"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClassRenderer", function() { return _renderer_class_renderer__WEBPACK_IMPORTED_MODULE_22__["ClassRenderer"]; });

/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./util/bound */ "../dist/util/bound.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Bound", function() { return _util_bound__WEBPACK_IMPORTED_MODULE_23__["Bound"]; });

/* harmony import */ var _util_color__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./util/color */ "../dist/util/color.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return _util_color__WEBPACK_IMPORTED_MODULE_24__["Color"]; });

/* harmony import */ var _util_subject__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./util/subject */ "../dist/util/subject.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Subject", function() { return _util_subject__WEBPACK_IMPORTED_MODULE_25__["Subject"]; });

/* harmony import */ var _animation_animation__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./animation/animation */ "../dist/animation/animation.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Animation", function() { return _animation_animation__WEBPACK_IMPORTED_MODULE_26__["Animation"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PointAnimation", function() { return _animation_animation__WEBPACK_IMPORTED_MODULE_26__["PointAnimation"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LineAnimation", function() { return _animation_animation__WEBPACK_IMPORTED_MODULE_26__["LineAnimation"]; });

/* harmony import */ var _animation_particle_animation__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./animation/particle-animation */ "../dist/animation/particle-animation.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ParticleAnimation", function() { return _animation_particle_animation__WEBPACK_IMPORTED_MODULE_27__["ParticleAnimation"]; });

/* harmony import */ var _element_raster__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./element/raster */ "../dist/element/raster.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Raster", function() { return _element_raster__WEBPACK_IMPORTED_MODULE_28__["Raster"]; });

/* harmony import */ var _layer_raster_layer__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./layer/raster-layer */ "../dist/layer/raster-layer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RasterLayer", function() { return _layer_raster_layer__WEBPACK_IMPORTED_MODULE_29__["RasterLayer"]; });

/* harmony import */ var _analysis_interpolation_kriging__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./analysis/interpolation/kriging */ "../dist/analysis/interpolation/kriging.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Kriging", function() { return _analysis_interpolation_kriging__WEBPACK_IMPORTED_MODULE_30__["Kriging"]; });

/* harmony import */ var _analysis_heat_heat__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./analysis/heat/heat */ "../dist/analysis/heat/heat.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Heat", function() { return _analysis_heat_heat__WEBPACK_IMPORTED_MODULE_31__["Heat"]; });

/* harmony import */ var _analysis_interpolation_inverse_distance_weight__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./analysis/interpolation/inverse-distance-weight */ "../dist/analysis/interpolation/inverse-distance-weight.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InverseDistanceWeight", function() { return _analysis_interpolation_inverse_distance_weight__WEBPACK_IMPORTED_MODULE_32__["InverseDistanceWeight"]; });

/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./tile */ "../dist/tile.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Tile", function() { return _tile__WEBPACK_IMPORTED_MODULE_33__["Tile"]; });





































/***/ }),

/***/ "../dist/label/collision.js":
/*!**********************************!*\
  !*** ../dist/label/collision.js ***!
  \**********************************/
/*! exports provided: Collision, NullCollision, SimpleCollision, CoverCollision */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Collision", function() { return Collision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NullCollision", function() { return NullCollision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleCollision", function() { return SimpleCollision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoverCollision", function() { return CoverCollision; });
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");


/**
 * 冲突检测基类
 */
class Collision {
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features, field, symbol, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"]()) { return []; }
}
/**
 * 无检测机制
 */
class NullCollision {
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features, field, symbol, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"]()) {
        //没有任何检测逻辑，直接原样返回
        return features;
    }
}
/**
 * 简单碰撞冲突
 * @remarks
 * 类似聚合，距离判断，速度快
 */
class SimpleCollision {
    constructor() {
        /**
         * 检测距离
         * @remarks
         * 单位 pixel
         */
        this.distance = 50;
    }
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features, field, symbol, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"]()) {
        //根据距离聚合
        return features.reduce((acc, cur) => {
            const item = acc.find((item) => {
                const distance = cur.geometry.distance(item.geometry, _geometry_geometry__WEBPACK_IMPORTED_MODULE_0__["CoordinateType"].Screen, ctx, projection);
                return distance <= this.distance;
            });
            if (!item)
                acc.push(cur);
            return acc;
        }, []); // [feature]
    }
}
/**
 * 叠盖碰撞冲突
 * @remarks
 * 试算标注宽高，并和已通过检测的标注，进行边界的交叉判断，速度慢
 */
class CoverCollision {
    constructor() {
        /**
         * 已通过检测的标注的边界集合
         */
        this._bounds = [];
        /**
         * 判断边界碰撞时的buffer
         * @remarks
         * buffer越小，标注越密，单位：pixel
         */
        this.buffer = 10;
    }
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features, field, symbol, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"]()) {
        if (!field || !symbol)
            return [];
        this._bounds = [];
        //根据标注宽高的量算，得到标注的size，并和已通过检测的标注，进行边界的交叉判断，来决定是否可绘制该要素的标注
        return features.reduce((acc, cur) => {
            const bound = cur.geometry.measure(cur.properties[field.name], ctx, projection, symbol);
            if (bound) {
                bound.buffer(this.buffer);
                const item = this._bounds.find(item => item.intersect(bound));
                if (!item) {
                    acc.push(cur);
                    this._bounds.push(bound);
                }
            }
            return acc;
        }, []); // [feature]
    }
}


/***/ }),

/***/ "../dist/label/label.js":
/*!******************************!*\
  !*** ../dist/label/label.js ***!
  \******************************/
/*! exports provided: Label */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Label", function() { return Label; });
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _collision__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./collision */ "../dist/label/collision.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");



/**
 * 图层标注设置
 */
class Label {
    constructor() {
        /**
         * 标注符号
         * @remarks
         * 参考Renderer和Feature中的相关重要说明
         */
        this.symbol = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimpleTextSymbol"]();
        /**
         * 标注冲突解决方式
         */
        this.collision = new _collision__WEBPACK_IMPORTED_MODULE_1__["SimpleCollision"]();
    }
    /**
     * 绘制图层标注
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    draw(features, ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_2__["WebMercator"]()) {
        //通过冲突检测，得到要绘制的要素集合
        const remain = this.collision.test(features, this.field, this.symbol, ctx, projection);
        //遍历绘制要素标注
        remain.forEach((feature) => {
            feature.label(this.field, ctx, projection, this.symbol);
        });
    }
}


/***/ }),

/***/ "../dist/layer/feature-layer.js":
/*!**************************************!*\
  !*** ../dist/layer/feature-layer.js ***!
  \**************************************/
/*! exports provided: FeatureLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureLayer", function() { return FeatureLayer; });
/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layer */ "../dist/layer/layer.js");
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony import */ var _renderer_simple_renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../renderer/simple-renderer */ "../dist/renderer/simple-renderer.js");
/* harmony import */ var _renderer_category_renderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../renderer/category-renderer */ "../dist/renderer/category-renderer.js");
/* harmony import */ var _renderer_class_renderer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../renderer/class-renderer */ "../dist/renderer/class-renderer.js");
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _geometry_point__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../geometry/point */ "../dist/geometry/point.js");
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");








/**
 * 矢量要素图层
 */
class FeatureLayer extends _layer__WEBPACK_IMPORTED_MODULE_0__["Layer"] {
    constructor() {
        super(...arguments);
        /**
         * 图层可见缩放级别
         */
        this._zoom = [3, 20];
        /**
         * 是否显示标注
         */
        this.labeled = false;
        /**
         * 是否聚合
         */
        this.cluster = false;
    }
    /**
     * 矢量要素类（数据源）
     */
    get featureClass() {
        return this._featureClass;
    }
    /**
     * 矢量要素类（数据源）
     */
    set featureClass(value) {
        this._featureClass = value;
    }
    /**
     * 图层标注设置
     */
    set label(value) {
        this._label = value;
    }
    /**
     * 图层渲染方式设置
     */
    set renderer(value) {
        this._renderer = value;
    }
    /**
    * 重写事件注册监听
    * @remarks
    * 对图层的监听，重写为遍历对该图层下所有要素的监听
    * 该写法只是一种简写，无他。
    * @param {string} event - 事件名称
    * @param {Function} handler - 回调函数
    */
    on(event, handler) {
        this._featureClass.features.forEach((feature) => {
            feature.on(event, handler);
        });
    }
    /**
     * 重写事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event, handler) {
        this._featureClass.features.forEach((feature) => {
            feature.off(event, handler);
        });
    }
    /**
     * 重写事件激发
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event, param) {
        this._featureClass.features.forEach((feature) => {
            feature.emit(event, param);
        });
    }
    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10) {
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            //过滤可见视图范围内的要素
            const features = this._featureClass.features.filter((feature) => feature.intersect(projection, extent));
            //获取当前渲染方式下，某一要素对应的渲染符号
            const _getSymbol = (feature) => {
                if (this._renderer instanceof _renderer_simple_renderer__WEBPACK_IMPORTED_MODULE_2__["SimpleRenderer"]) {
                    return this._renderer.symbol;
                }
                else if (this._renderer instanceof _renderer_category_renderer__WEBPACK_IMPORTED_MODULE_3__["CategoryRenderer"]) {
                    const renderer = this._renderer;
                    const item = renderer.items.find(item => item.value == feature.properties[renderer.field.name]);
                    if (item)
                        return item.symbol;
                }
                else if (this._renderer instanceof _renderer_class_renderer__WEBPACK_IMPORTED_MODULE_4__["ClassRenderer"]) {
                    const renderer = this._renderer;
                    const item = renderer.items.find(item => item.low <= feature.properties[renderer.field.name] && item.high >= feature.properties[renderer.field.name]);
                    if (item)
                        return item.symbol;
                }
            };
            //如果是点图层，同时又设置为聚合显示时
            if (this._featureClass.type == _geometry_geometry__WEBPACK_IMPORTED_MODULE_5__["GeometryType"].Point && this.cluster) {
                //简单距离聚合
                const cluster = features.reduce((acc, cur) => {
                    if (cur.geometry instanceof _geometry_point__WEBPACK_IMPORTED_MODULE_6__["Point"]) {
                        const point = cur.geometry;
                        const item = acc.find((item) => {
                            const distance = point.distance(item.feature.geometry, _geometry_geometry__WEBPACK_IMPORTED_MODULE_5__["CoordinateType"].Screen, ctx, projection);
                            return distance <= 50;
                        });
                        if (item) {
                            item.count += 1;
                        }
                        else {
                            acc.push({ feature: cur, count: 1 });
                        }
                        return acc;
                    }
                }, []); // [{feature, count}]
                cluster.forEach((item) => {
                    if (item.count == 1) {
                        item.feature.draw(ctx, projection, extent, _getSymbol(item.feature));
                    }
                    else {
                        item.feature.draw(ctx, projection, extent, new _symbol_symbol__WEBPACK_IMPORTED_MODULE_7__["ClusterSymbol"](item.count));
                    }
                });
            }
            else {
                //不是聚合时，正常绘制图层下各要素
                features.forEach((feature) => {
                    feature.draw(ctx, projection, extent, _getSymbol(feature));
                });
            }
        }
    }
    /**
     * 绘制标注
     * @remarks
     * 本应起名为label，但与属性中setter重名，故起名为drawLabel，无奈。。。
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    drawLabel(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10) {
        if (this.visible && !this.cluster && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            const features = this._featureClass.features.filter((feature) => feature.intersect(projection, extent));
            this._label.draw(features, ctx, projection);
        }
    }
    /**
     * 图层交互
     * @remarks 当前鼠标是否落入该图层某要素
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10, event = undefined) {
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            //if call Array.some, maybe abort mouseout last feature which mouseover!!! but filter maybe cause slow!!!no choice
            //return this._featureClass.features.filter((feature: Feature) => feature.intersect(projection, extent)).some( (feature: Feature) => {
            //遍历与当前视图与相交的要素，判断坐标是否落入相应要素
            const features = this._featureClass.features.filter((feature) => feature.intersect(projection, extent)).filter((feature) => {
                return feature.contain(screenX, screenY, event);
            });
            if (features.length > 0) {
                //如为dblclick、click，则触发该图形的对应事件
                //多个时，默认只触发第一个，该行为可被重写。
                if (event == "dblclick") {
                    features[0].emit("dblclick", { feature: features[0], screenX: screenX, screenY: screenY });
                }
                else if (event == "click") {
                    features[0].emit("click", { feature: features[0], screenX: screenX, screenY: screenY });
                }
                return true;
            }
            else {
                return false;
            }
        }
    }
}


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


/**
 * 图形要素图层
 */
class GraphicLayer extends _layer__WEBPACK_IMPORTED_MODULE_0__["Layer"] {
    constructor() {
        super(...arguments);
        /**
         * 图形要素集合
         */
        this._graphics = [];
    }
    /**
     * 重写事件注册监听
     * @remarks
     * 对图层的监听，重写为遍历对该图层下所有要素的监听
     * 该写法只是一种简写，无他。
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    on(event, handler) {
        this._graphics.forEach((graphic) => {
            graphic.on(event, handler);
        });
    }
    /**
     * 重写事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event, handler) {
        this._graphics.forEach((graphic) => {
            graphic.off(event, handler);
        });
    }
    /**
     * 重写事件激发
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event, param) {
        this._graphics.forEach((graphic) => {
            graphic.emit(event, param);
        });
    }
    /**
     * 添加图形
     * @param {Graphic} graphic - 图形
     */
    add(graphic) {
        this._graphics.push(graphic);
    }
    /**
     * 删除图形
     * @param {Graphic} graphic - 图形
     */
    remove(graphic) {
        const index = this._graphics.findIndex(item => item === graphic);
        index != -1 && this._graphics.splice(index, 1);
    }
    /**
     * 清空图形集合
     */
    clear() {
        this._graphics = [];
    }
    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10) {
        if (this.visible) {
            this._graphics.forEach((graphic) => {
                graphic.draw(ctx, projection, extent);
            });
        }
    }
    /**
     * 图层交互
     * @remarks 当前鼠标是否落入该图层某要素
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"](), extent = projection.bound, zoom = 10, event = undefined) {
        if (this.visible) {
            //遍历可视范围内的图形，判断是否落入某个图形
            const graphics = this._graphics.filter((graphic) => graphic.intersect(projection, extent)).filter((graphic) => {
                return graphic.contain(screenX, screenY, event);
            });
            if (graphics.length > 0) {
                //如为dblclick、click，则触发该图形的对应事件
                //多个时，默认只触发第一个，该行为可被重写。
                if (event == "dblclick") {
                    graphics[0].emit("dblclick", { graphic: graphics[0], screenX: screenX, screenY: screenY });
                }
                else if (event == "click") {
                    graphics[0].emit("click", { graphic: graphics[0], screenX: screenX, screenY: screenY });
                }
                return true;
            }
            else {
                return false;
            }
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
/* harmony import */ var _util_subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/subject */ "../dist/util/subject.js");


/**
 * 图层基类
 */
class Layer extends _util_subject__WEBPACK_IMPORTED_MODULE_1__["Subject"] {
    /**
     * 创建图层
     */
    constructor() {
        super([]);
        /**
         * 图层可见设置
         */
        this._visible = true;
        /**
         * 图层可交互设置
         */
        this._interactive = true;
    }
    /**
     * 图层是否可见
     */
    get visible() {
        return this._visible;
    }
    /**
     * 图层可见设置
     */
    set visible(value) {
        this._visible = value;
    }
    /**
     * 图层是否可交互
     */
    get interactive() {
        return this._interactive;
    }
    /**
     * 图层可交互设置
     */
    set interactive(value) {
        this._interactive = value;
    }
    /**
     * 绘制图层
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"](), extent = projection.bound, zoom = 10) { }
    ;
    /**
     * 图层交互
     * @remarks 当前鼠标是否落入该图层某要素
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"](), extent = projection.bound, zoom = 10, event = undefined) { return false; }
}


/***/ }),

/***/ "../dist/layer/raster-layer.js":
/*!*************************************!*\
  !*** ../dist/layer/raster-layer.js ***!
  \*************************************/
/*! exports provided: RasterLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RasterLayer", function() { return RasterLayer; });
/* harmony import */ var _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projection/web-mercator */ "../dist/projection/web-mercator.js");
/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layer */ "../dist/layer/layer.js");


/**
 * 栅格图层
 */
class RasterLayer extends _layer__WEBPACK_IMPORTED_MODULE_1__["Layer"] {
    constructor() {
        super(...arguments);
        /**
         * 图层可交互设置
         */
        this._interactive = false;
    }
    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_0__["WebMercator"](), extent = projection.bound, zoom = 10) {
        if (this.visible) {
            this.raster && this.raster.draw(ctx, projection, extent, zoom);
        }
    }
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
/* harmony import */ var _layer_feature_layer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layer/feature-layer */ "../dist/layer/feature-layer.js");
/* harmony import */ var _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./layer/graphic-layer */ "../dist/layer/graphic-layer.js");
/* harmony import */ var _util_subject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/subject */ "../dist/util/subject.js");
/* harmony import */ var _animator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./animator */ "../dist/animator.js");
/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tile */ "../dist/tile.js");







/**
* 地图
*/
class Map extends _util_subject__WEBPACK_IMPORTED_MODULE_4__["Subject"] {
    /**
     * 创建地图
     * @param {string | HTMLDivElement} id - HTMLDivElement | id
     */
    constructor(id) {
        //extent: 视图范围更新时
        //click:  单击地图时
        //dblclick: 双击地图时
        //mousemove: 鼠标移动时
        //resize: 视图容器尺寸调整时
        super(["extent", "click", "dblclick", "mousemove", "resize"]);
        //默认为地图添加一个图形图层，为地图添加图形接口提供便捷，语法糖而已，无他
        this._defaultGraphicLayer = new _layer_graphic_layer__WEBPACK_IMPORTED_MODULE_3__["GraphicLayer"]();
        //图层集合
        this._layers = [];
        //地图缩放等级
        this._zoom = 1;
        //地图视图中心
        this._center = [0, 0];
        //地图漫游操作相关私有变量及标记
        //辅助响应mousedown mouseup，完成地图漫游（平移）
        this._drag = {
            //是否处于漫游状态
            flag: false,
            //漫游起始坐标
            start: {
                x: 0,
                y: 0
            },
            //漫游结束坐标
            end: {
                x: 0,
                y: 0
            }
        };
        this._container = id instanceof HTMLDivElement ? id : document.getElementById(id);
        //create canvas
        this._canvas = document.createElement("canvas");
        this._canvas.style.cssText = "position: absolute; height: 100%; width: 100%; z-index: 100";
        this._canvas.width = this._container.clientWidth;
        this._canvas.height = this._container.clientHeight;
        this._container.appendChild(this._canvas);
        this._ctx = this._canvas.getContext("2d");
        //bind this，请参考js中this相关知识
        this._onClick = this._onClick.bind(this);
        this._onDoubleClick = this._onDoubleClick.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onWheel = this._onWheel.bind(this);
        //添加canvas listener
        this._canvas.addEventListener("click", this._onClick);
        this._canvas.addEventListener("dblclick", this._onDoubleClick);
        this._canvas.addEventListener("mousedown", this._onMouseDown);
        this._canvas.addEventListener("mousemove", this._onMouseMove);
        this._canvas.addEventListener("mouseup", this._onMouseUp);
        this._canvas.addEventListener("wheel", this._onWheel);
        //animator
        this._animator = new _animator__WEBPACK_IMPORTED_MODULE_5__["Animator"](this);
        //tile
        this._tile = new _tile__WEBPACK_IMPORTED_MODULE_6__["Tile"](this);
        //初始化
        this._projection = new _projection_web_mercator__WEBPACK_IMPORTED_MODULE_1__["WebMercator"]();
        this.setView([0, 0], 10);
        //响应窗体resize
        //非常重要，resize后响应，完成重绘
        this._onResize = this._onResize.bind(this);
        window.addEventListener("resize", this._onResize);
    }
    /**
     * DIV容器
     */
    get container() {
        return this._container;
    }
    /**
     * 视图中心
     */
    get center() {
        return this._center;
    }
    /**
     * 可视范围
     */
    get extent() {
        return this._extent;
    }
    /**
     * 缩放级别
     */
    get zoom() {
        return this._zoom;
    }
    /**
     * 坐标投影变换
     * @type {Projection}
     * @readonly
     */
    get projection() {
        return this._projection;
    }
    /**
     * 设置坐标投影变换
     * @param {Projection} projection - 坐标投影变换
     */
    setProjection(projection) {
        this._projection = projection;
        //const bound: Bound = this._projection.bound;
        //this._ctx.setTransform(256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale , 0, 0, 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale, this._canvas.width / 2, this._canvas.height / 2);
        //center为经纬度，转化为平面坐标
        const origin = this._projection.project(this._center);
        const bound = this._projection.bound;
        //已知：地理坐标origin，转换后屏幕坐标 即canvas的中心 [this._canvas.width / 2, this._canvas.height / 2]
        //求：平面坐标转换矩阵=Map初始矩阵:  地理坐标——屏幕坐标
        //解法如下：
        const a = 256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale;
        const d = 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale;
        const e = this._canvas.width / 2 - a * origin[0];
        const f = this._canvas.height / 2 - d * origin[1];
        this._ctx.setTransform(a, 0, 0, d, e, f);
    }
    /**
     * 设置视图级别及视图中心
     * @param {number[]} center - 视图中心
     * @param {number} zoom - 视图级别
     */
    setView(center = [0, 0], zoom = 3) {
        this._center = center;
        this._zoom = Math.max(3, Math.min(20, zoom));
        //center为经纬度，转化为平面坐标
        const origin = this._projection.project(center);
        const bound = this._projection.bound;
        //已知：地理坐标origin，转换后屏幕坐标 即canvas的中心 [this._canvas.width / 2, this._canvas.height / 2]
        //求：平面坐标转换矩阵=Map初始矩阵:  地理坐标——屏幕坐标
        //解法如下：
        const a = 256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale;
        const d = 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale;
        const e = this._canvas.width / 2 - a * origin[0];
        const f = this._canvas.height / 2 - d * origin[1];
        this._ctx.setTransform(a, 0, 0, d, e, f);
        this.redraw();
    }
    /**
     * 添加图层
     * @param {Layer} layer - 图层
     */
    addLayer(layer) {
        this._layers.push(layer);
        layer.draw(this._ctx, this._projection, this._extent);
    }
    /**
     * 插入图层
     * @param {Layer} layer - 图层
     * @param {number} index - 图层顺序
     */
    insertLayer(layer, index = -1) {
        index = index > this._layers.length ? -1 : index;
        if (index == -1) {
            this.addLayer(layer);
        }
        else {
            this._layers.splice(index, 0, layer);
            this.redraw();
        }
    }
    /**
     * 移除图层
     * @param {Layer} layer - 图层
     */
    removeLayer(layer) {
        const index = this._layers.findIndex(item => item === layer);
        index != -1 && this._layers.splice(index, 1);
        this.redraw();
    }
    /**
     * 清空图层
     */
    clearLayers() {
        this._layers = [];
        this.redraw();
    }
    /**
     * 添加图形
     * 参考_defaultGraphicLayer定义处的说明
     * shortcut
     * @param {Graphic} graphic - 图形
     */
    addGraphic(graphic) {
        this._defaultGraphicLayer.add(graphic);
        graphic.draw(this._ctx, this._projection, this._extent);
    }
    /**
     * 添加动画
     * @param {Animation} animation - 动画
     */
    addAnimation(animation) {
        this._animator.addAnimation(animation);
    }
    /**
     * 删除动画
     * @param {Animation} animation - 动画
     */
    removeAnimation(animation) {
        this._animator.removeAnimation(animation);
    }
    /**
     * 清除动画
     */
    clearAnimations() {
        this._animator.clearAnimations();
    }
    /**
     * 设置切片url
     */
    setTileUrl(url) {
        this._tile.url = url;
    }
    /**
     * 更新地图视图范围以及中心点
     */
    updateExtent() {
        const matrix = this._ctx.getTransform();
        const x1 = (0 - matrix.e) / matrix.a, y1 = (0 - matrix.f) / matrix.d, x2 = (this._canvas.width - matrix.e) / matrix.a, y2 = (this._canvas.height - matrix.f) / matrix.d;
        this._extent = new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2));
        this._center = this._projection.unproject([(x1 + x2) / 2, (y1 + y2) / 2]);
        //this._events.extent.forEach(handler => handler({extent: this._extent, center: this._center, zoom: this._zoom, matrix: matrix}));
        this.emit("extent", { extent: this._extent, center: this._center, zoom: this._zoom, matrix: matrix });
    }
    /**
     * 重绘
     */
    redraw() {
        this._ctx.save();
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
        this.updateExtent();
        //this._geometries.forEach(geometry => geometry.draw(this._ctx));
        this._defaultGraphicLayer.draw(this._ctx, this._projection, this._extent, this._zoom);
        //重绘要素
        this._layers.forEach(layer => {
            layer.draw(this._ctx, this._projection, this._extent, this._zoom);
        });
        //重绘标注
        //分开的原因，一般标注在上！
        this._layers.filter(layer => layer instanceof _layer_feature_layer__WEBPACK_IMPORTED_MODULE_2__["FeatureLayer"] && layer.labeled).forEach((layer) => {
            layer.drawLabel(this._ctx, this._projection, this._extent, this._zoom);
        });
    }
    /**
     * 清空视图
     */
    clear() {
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    //响应窗体resize
    _onResize(event) {
        this._canvas.width = this._container.clientWidth;
        this._canvas.height = this._container.clientHeight;
        this.emit("resize", event);
        this.setView(this._center, this._zoom);
    }
    //响应canvas被点击
    _onClick(event) {
        //this._handlers["click"].forEach(handler => handler(event));
        //探测是否有图层要素被点击
        this._layers.filter(layer => layer.interactive).some(layer => layer.contain(event.offsetX, event.offsetY, this.projection, this._extent, this._zoom, "click"));
        //地图点击响应
        this.emit("click", event);
    }
    //响应canvas被双击
    //默认交互，双击放大一倍
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
        this.emit("dblclick", event);
    }
    //响应canvas mousedown
    //漫游起始
    _onMouseDown(event) {
        //设置为漫游状态
        this._drag.flag = true;
        this._drag.start.x = event.x;
        this._drag.start.y = event.y;
    }
    _onMouseMove(event) {
        //在非漫游状态下，触发mousemove事件
        if (!this._drag.flag) {
            //探测鼠标是否悬停到某图层要素
            this._layers.filter(layer => layer.interactive).filter(layer => layer.contain(event.offsetX, event.offsetY, this.projection, this._extent, this._zoom, "mousemove"));
            //地图鼠标移动响应
            this.emit("mousemove", event);
        }
    }
    //响应canvas mouseup
    //漫游结束
    _onMouseUp(event) {
        //在漫游状态下
        if (this._drag.flag) {
            //记录漫游结束坐标，并进行平移
            this._drag.end.x = event.x;
            this._drag.end.y = event.y;
            const matrix = this._ctx.getTransform();
            this._ctx.translate((this._drag.end.x - this._drag.start.x) / matrix.a, (this._drag.end.y - this._drag.start.y) / matrix.d);
            this.redraw();
        }
        this._drag.flag = false;
    }
    //响应滚轮缩放
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
        //交互表现为 鼠标当前位置 屏幕坐标不变 进行缩放 即x2 = x1，y2=y1
        //其它设定：变换前矩阵(a1,0,0,d1,e1,f1)   变换矩阵(a,0,0,d,e,f)  变换后矩阵(a2,0,0,d2,e2,f2) 
        //scale已通过滚轮变化，换算得到，且a=d=scale，求e和f
        //1.将原屏幕坐标 x1 转成 地理坐标 x0 = (x1 - e1) / a1 
        //2.地理坐标x0 转成 现屏幕坐标x2  a2 * x0 + e2 = x2 e2 = x2 - a2 * x0 代入1式 e2 = x2 - a2 * (x1 - e1) / a1
        //3.已知scale = a2 / a1 故 e2 = x2 - scale * (x1 - e1)
        //4.另矩阵变换 a1 * e + e1 = e2
        //5.联立3和4 求得 e = (x2 - scale * (x1 - e1) - e1) / a1
        const matrix = this._ctx.getTransform();
        const a1 = matrix.a, e1 = matrix.e, x1 = event.x, x2 = x1; //放大到中心点 x2 = this._canvas.width / 2
        const e = (x2 - scale * (x1 - e1) - e1) / a1;
        const d1 = matrix.d, f1 = matrix.f, y1 = event.y, y2 = y1; //放大到中心点 y2 = this._canvas.height / 2
        const f = (y2 - scale * (y1 - f1) - f1) / d1;
        this._ctx.transform(scale, 0, 0, scale, e, f);
        this.redraw();
    }
    /**
     * 销毁
     */
    destroy() {
        window.removeEventListener("resize", this._onResize);
        this._canvas.removeEventListener("click", this._onClick);
        this._canvas.removeEventListener("dblclick", this._onDoubleClick);
        this._canvas.removeEventListener("mousedown", this._onMouseDown);
        this._canvas.removeEventListener("mousemove", this._onMouseMove);
        this._canvas.removeEventListener("mouseup", this._onMouseUp);
        this._canvas.removeEventListener("wheel", this._onWheel);
    }
}


/***/ }),

/***/ "../dist/projection/bd09.js":
/*!**********************************!*\
  !*** ../dist/projection/bd09.js ***!
  \**********************************/
/*! exports provided: BD09 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BD09", function() { return BD09; });
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _projection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projection */ "../dist/projection/projection.js");
/* harmony import */ var _gcj02__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gcj02 */ "../dist/projection/gcj02.js");



/**
 * 带百度09偏移的球体墨卡托投影
 * @remarks https://github.com/wandergis/coordtransform
 * just for china
 * 依赖Baidu Map API
 */
class BD09 extends _projection__WEBPACK_IMPORTED_MODULE_1__["Projection"] {
    /**
     * 创建带国测局02偏移的球体墨卡托投影
     * @remarks 参考经纬度坐标类型，不同类型走不同数据处理流程
     * @param {LatLngType} type - 经纬度坐标类型
     */
    constructor(type = _projection__WEBPACK_IMPORTED_MODULE_1__["LatLngType"].GPS) {
        super();
        this._type = type;
    }
    /**
     * 投影后的平面坐标范围
     */
    get bound() {
        return new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](-BD09.TOTAL_PIXELS / 2, BD09.TOTAL_PIXELS / 2, BD09.TOTAL_PIXELS / 2, -BD09.TOTAL_PIXELS / 2);
    }
    /**
     * 经纬度转平面坐标
     * @remarks 地理平面坐标 单位米
     * @param {number} lng - 经度
     * @param {number} lat - 纬度
     * @return {number[]} 地理平面坐标
     */
    project([lng, lat]) {
        //from leaflet & wiki
        if (this._type == _projection__WEBPACK_IMPORTED_MODULE_1__["LatLngType"].GPS) {
            [lng, lat] = _gcj02__WEBPACK_IMPORTED_MODULE_2__["GCJ02"].wgs84togcj02(lng, lat);
            [lng, lat] = BD09.gcj02tobd09(lng, lat);
        }
        else if (this._type == _projection__WEBPACK_IMPORTED_MODULE_1__["LatLngType"].GCJ02) {
            [lng, lat] = BD09.gcj02tobd09(lng, lat);
        }
        const projection = new BMap.MercatorProjection();
        const pixel = projection.lngLatToPoint(new BMap.Point(lng, lat));
        return [pixel.x, pixel.y];
        /*const d = Math.PI / 180, sin = Math.sin(lat * d);
        return [WebMercator.R * lng * d,  WebMercator.R * Math.log((1 + sin) / (1 - sin)) / 2];*/
    }
    /**
     * 平面坐标转经纬度
     * @remarks 地理平面坐标 单位米
     * @param {number} x - 地理平面坐标x
     * @param {number} y - 地理平面坐标y
     * @return {number[]} 经纬度
     */
    unproject([x, y]) {
        const projection = new BMap.MercatorProjection();
        const point = projection.pointToLngLat(new BMap.Pixel(x, y));
        return [point.lng, point.lat];
        /*const d = 180 / Math.PI;
        return  [x * d / WebMercator.R, (2 * Math.atan(Math.exp(y / WebMercator.R)) - (Math.PI / 2)) * d];*/
    }
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
     * @remarks
     * from https://github.com/wandergis/coordtransform
     * 即 百度 转 谷歌、高德
     * @param bd_lng
     * @param bd_lat
     * @returns {number[]}
     */
    static bd09togcj02(bd_lng, bd_lat) {
        var x = bd_lng - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI * 3000.0 / 180.0);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI * 3000.0 / 180.0);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }
    ;
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * @remarks
     * from https://github.com/wandergis/coordtransform
     * 即 谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static gcj02tobd09(lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * Math.PI * 3000.0 / 180.0);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * Math.PI * 3000.0 / 180.0);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
    }
    ;
}
/**
 * 百度平面坐标系的坐标原点与百度瓦片坐标原点相同，以瓦片等级18级为基准，规定18级时百度平面坐标的一个单位等于屏幕上的一个像素
 */
BD09.TOTAL_PIXELS = 256 * Math.pow(2, 18);


/***/ }),

/***/ "../dist/projection/gcj02.js":
/*!***********************************!*\
  !*** ../dist/projection/gcj02.js ***!
  \***********************************/
/*! exports provided: GCJ02 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GCJ02", function() { return GCJ02; });
/* harmony import */ var _util_bound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/bound */ "../dist/util/bound.js");
/* harmony import */ var _projection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projection */ "../dist/projection/projection.js");


/**
 * 带国测局02偏移的球体墨卡托投影
 * @remarks https://github.com/wandergis/coordtransform
 * just for china
 */
class GCJ02 extends _projection__WEBPACK_IMPORTED_MODULE_1__["Projection"] {
    /**
     * 创建带国测局02偏移的球体墨卡托投影
     * @remarks 参考经纬度坐标类型，不同类型走不同数据处理流程
     * @param {LatLngType} type - 经纬度坐标类型
     */
    constructor(type = _projection__WEBPACK_IMPORTED_MODULE_1__["LatLngType"].GPS) {
        super();
        this._type = type;
    }
    /**
     * 投影后的平面坐标范围
     */
    get bound() {
        return new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](-Math.PI * GCJ02.R, Math.PI * GCJ02.R, Math.PI * GCJ02.R, -Math.PI * GCJ02.R);
    }
    /**
     * 经纬度转平面坐标
     * @remarks 地理平面坐标 单位米
     * @param {number} lng - 经度
     * @param {number} lat - 纬度
     * @return {number[]} 地理平面坐标
     */
    project([lng, lat]) {
        if (this._type == _projection__WEBPACK_IMPORTED_MODULE_1__["LatLngType"].GPS) {
            [lng, lat] = GCJ02.wgs84togcj02(lng, lat);
        }
        //from leaflet & wiki
        const d = Math.PI / 180, sin = Math.sin(lat * d);
        return [GCJ02.R * lng * d, GCJ02.R * Math.log((1 + sin) / (1 - sin)) / 2];
    }
    /**
     * 平面坐标转经纬度
     * @remarks 地理平面坐标 单位米
     * @param {number} x - 地理平面坐标x
     * @param {number} y - 地理平面坐标y
     * @return {number[]} 经纬度
     */
    unproject([x, y]) {
        const d = 180 / Math.PI;
        return [x * d / GCJ02.R, (2 * Math.atan(Math.exp(y / GCJ02.R)) - (Math.PI / 2)) * d];
    }
    /**
     * WGS-84 转 GCJ-02
     * @remarks https://github.com/wandergis/coordtransform
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static wgs84togcj02(lng, lat) {
        var dlat = this._transformlat(lng - 105.0, lat - 35.0);
        var dlng = this._transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * Math.PI;
        var magic = Math.sin(radlat);
        magic = 1 - GCJ02.ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((GCJ02.R * (1 - GCJ02.ee)) / (magic * sqrtmagic) * Math.PI);
        dlng = (dlng * 180.0) / (GCJ02.R / sqrtmagic * Math.cos(radlat) * Math.PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat];
    }
    ;
    /**
     * GCJ-02 转换为 WGS-84
     * @remarks https://github.com/wandergis/coordtransform
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static gcj02towgs84(lng, lat) {
        var dlat = this._transformlat(lng - 105.0, lat - 35.0);
        var dlng = this._transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * Math.PI;
        var magic = Math.sin(radlat);
        magic = 1 - GCJ02.ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((GCJ02.R * (1 - GCJ02.ee)) / (magic * sqrtmagic) * Math.PI);
        dlng = (dlng * 180.0) / (GCJ02.R / sqrtmagic * Math.cos(radlat) * Math.PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
    ;
    static _transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }
    ;
    static _transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0;
        return ret;
    }
    ;
    /**
     * 判断是否在国内，不在国内则不做偏移
     * @remarks 此判断欠妥，暂不采用！
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    static out_of_china(lng, lat) {
        // 纬度 3.86~53.55, 经度 73.66~135.05
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }
    ;
}
/**
 * 地球半径
 */
GCJ02.R = 6378137.0;
/**
 * ee
 * @remarks
 * 不知含义的常数，用于WGS-84 与 GCJ-02 之间的转换
 */
GCJ02.ee = 0.00669342162296594323;


/***/ }),

/***/ "../dist/projection/projection.js":
/*!****************************************!*\
  !*** ../dist/projection/projection.js ***!
  \****************************************/
/*! exports provided: LatLngType, Projection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LatLngType", function() { return LatLngType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Projection", function() { return Projection; });
/**
 * 经纬度坐标类型
 * @remarks
 * 本应无此一说，坐标偏移的无奈之举
 */
var LatLngType;
(function (LatLngType) {
    /**
     * GPS采集的经纬度坐标（Default）
     */
    LatLngType[LatLngType["GPS"] = 1] = "GPS";
    /**
     * GCJ02偏移后的经纬度坐标（Default）
     * Just For China, AMap aka GaoDe
     */
    LatLngType[LatLngType["GCJ02"] = 2] = "GCJ02";
    /**
     * BD09偏移后的经纬度坐标（Default）
     * Just For China, BaiduMap
     */
    LatLngType[LatLngType["BD09"] = 3] = "BD09";
})(LatLngType || (LatLngType = {}));
/**
 * 坐标投影转换
 * @remarks
 * TODO: only support web mecator
 */
class Projection {
    /**
    * 经纬度转平面坐标
    * @remarks 地理平面坐标 单位米
    * @param {number} lng - 经度
    * @param {number} lat - 纬度
    * @return {number[]} 地理平面坐标
    */
    project([lng, lat]) { return []; }
    ;
    /**
     * 平面坐标转经纬度
     * @remarks 地理平面坐标 单位米
     * @param {number} x - 地理平面坐标x
     * @param {number} y - 地理平面坐标y
     * @return {number[]} 经纬度
     */
    unproject([x, y]) { return []; }
    ;
    /**
     * 投影后的平面坐标范围
     */
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


/**
 * 球体墨卡托
 */
class WebMercator extends _projection__WEBPACK_IMPORTED_MODULE_1__["Projection"] {
    /**
     * 投影后的平面坐标范围
     */
    get bound() {
        return new _util_bound__WEBPACK_IMPORTED_MODULE_0__["Bound"](-Math.PI * WebMercator.R, Math.PI * WebMercator.R, Math.PI * WebMercator.R, -Math.PI * WebMercator.R);
    }
    /**
     * 经纬度转平面坐标
     * @remarks 地理平面坐标 单位米
     * @param {number} lng - 经度
     * @param {number} lat - 纬度
     * @return {number[]} 地理平面坐标
     */
    project([lng, lat]) {
        //from leaflet & wiki
        const d = Math.PI / 180, sin = Math.sin(lat * d);
        return [WebMercator.R * lng * d, WebMercator.R * Math.log((1 + sin) / (1 - sin)) / 2];
    }
    /**
     * 平面坐标转经纬度
     * @remarks 地理平面坐标 单位米
     * @param {number} x - 地理平面坐标x
     * @param {number} y - 地理平面坐标y
     * @return {number[]} 经纬度
     */
    unproject([x, y]) {
        const d = 180 / Math.PI;
        return [x * d / WebMercator.R, (2 * Math.atan(Math.exp(y / WebMercator.R)) - (Math.PI / 2)) * d];
    }
}
/**
 * 地球半径
 */
WebMercator.R = 6378137;


/***/ }),

/***/ "../dist/renderer/category-renderer.js":
/*!*********************************************!*\
  !*** ../dist/renderer/category-renderer.js ***!
  \*********************************************/
/*! exports provided: CategoryRendererItem, CategoryRenderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CategoryRendererItem", function() { return CategoryRendererItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CategoryRenderer", function() { return CategoryRenderer; });
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _util_color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/color */ "../dist/util/color.js");



/**
* 分类渲染项
*/
class CategoryRendererItem {
    constructor() {
        /**
         * 该类总数
         */
        this.count = 1;
    }
}
/**
* 分类渲染
* @remarks
* 一般可通过设置分类字段，再调用generate自动生成分类渲染项
* 也可通过手动添加和定义分类渲染项，完成分类渲染设置，通过items.push()
*/
class CategoryRenderer {
    constructor() {
        /**
         * 所有分类集合
         */
        this._items = [];
    }
    /**
     * 分类字段
     * @remarks
     * 一般为字符串字段，也可为枚举域值，或是非布尔值
     */
    get field() {
        return this._field;
    }
    /**
     * 所有分类集合
     */
    get items() {
        return this._items;
    }
    /**
     * 根据分类字段，自动生成分类渲染项
     * @param {FeatureClass} featureClass - 要素类（要素集合）
     * @param {Field} field - 分类字段
     */
    generate(featureClass, field) {
        this._field = field;
        this._items = [];
        //分类统计
        featureClass.features.map(feature => feature.properties[field.name]).forEach((value) => {
            const item = this._items.find(item => item.value == value);
            if (item) {
                item.count += 1;
            }
            else {
                const item = new CategoryRendererItem();
                switch (featureClass.type) {
                    case _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Point:
                        const symbol1 = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimplePointSymbol"]();
                        symbol1.fillStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                        symbol1.strokeStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                        item.symbol = symbol1;
                        item.value = value;
                        this._items.push(item);
                        break;
                    case _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Polyline:
                        const symbol2 = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimpleLineSymbol"]();
                        symbol2.strokeStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                        item.symbol = symbol2;
                        item.value = value;
                        this._items.push(item);
                        break;
                    case _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Polygon:
                        const symbol3 = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimpleFillSymbol"]();
                        symbol3.fillStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                        symbol3.strokeStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                        item.symbol = symbol3;
                        item.value = value;
                        this._items.push(item);
                        break;
                }
            }
        });
    }
}


/***/ }),

/***/ "../dist/renderer/class-renderer.js":
/*!******************************************!*\
  !*** ../dist/renderer/class-renderer.js ***!
  \******************************************/
/*! exports provided: ClassRendererItem, ClassRenderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClassRendererItem", function() { return ClassRendererItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClassRenderer", function() { return ClassRenderer; });
/* harmony import */ var _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/symbol */ "../dist/symbol/symbol.js");
/* harmony import */ var _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../geometry/geometry */ "../dist/geometry/geometry.js");
/* harmony import */ var _util_color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/color */ "../dist/util/color.js");



/**
* 分级渲染项
* @remarks
* 分级区间一般为( ]: 即下开上闭
*/
class ClassRendererItem {
}
/**
* 分级渲染
* @remarks
* 一般可通过设置分级字段，再调用generate自动生成分级渲染项
* 也可通过手动添加和定义分级渲染项，完成分级渲染设置，通过items.push()
*/
class ClassRenderer {
    constructor() {
        /**
         * 所有分级渲染项集合
         */
        this._items = [];
    }
    /**
     * 分级字段
     * @remarks
     * 必须为数值型
     */
    get field() {
        return this._field;
    }
    /**
     * 所有分级渲染项集合
     */
    get items() {
        return this._items;
    }
    /**
     * 自动生成分级渲染项
     * @remarks
     * TODO: 分级有多种方式，目前只实现均分
     */
    generate(featureClass, field, breaks) {
        this._field = field;
        this._items = [];
        //获取该字段极值
        const stat = featureClass.features.map(feature => feature.properties[field.name]).reduce((stat, cur) => {
            stat.max = Math.max(cur, stat.max);
            stat.min = Math.min(cur, stat.max);
            return stat;
        }, { min: 0, max: 0 });
        for (let i = 0; i < breaks; i++) {
            const item = new ClassRendererItem();
            switch (featureClass.type) {
                case _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Point:
                    const symbol1 = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimplePointSymbol"]();
                    symbol1.fillStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                    symbol1.strokeStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                    item.symbol = symbol1;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i + 1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
                case _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Polyline:
                    const symbol2 = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimpleLineSymbol"]();
                    symbol2.strokeStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                    item.symbol = symbol2;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i + 1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
                case _geometry_geometry__WEBPACK_IMPORTED_MODULE_1__["GeometryType"].Polygon:
                    const symbol3 = new _symbol_symbol__WEBPACK_IMPORTED_MODULE_0__["SimpleFillSymbol"]();
                    symbol3.fillStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                    symbol3.strokeStyle = _util_color__WEBPACK_IMPORTED_MODULE_2__["Color"].random().toString();
                    item.symbol = symbol3;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i + 1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
            }
        }
    }
}


/***/ }),

/***/ "../dist/renderer/renderer.js":
/*!************************************!*\
  !*** ../dist/renderer/renderer.js ***!
  \************************************/
/*! exports provided: Renderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Renderer", function() { return Renderer; });
/**
* 渲染方式基类
*/
class Renderer {
}


/***/ }),

/***/ "../dist/renderer/simple-renderer.js":
/*!*******************************************!*\
  !*** ../dist/renderer/simple-renderer.js ***!
  \*******************************************/
/*! exports provided: SimpleRenderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleRenderer", function() { return SimpleRenderer; });
/**
* 单一渲染
*/
class SimpleRenderer {
}


/***/ }),

/***/ "../dist/symbol/symbol.js":
/*!********************************!*\
  !*** ../dist/symbol/symbol.js ***!
  \********************************/
/*! exports provided: Symbol, PointSymbol, LineSymbol, FillSymbol, SimplePointSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, SimpleTextSymbol, ClusterSymbol, LetterSymbol, ArrowSymbol */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Symbol", function() { return Symbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PointSymbol", function() { return PointSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LineSymbol", function() { return LineSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FillSymbol", function() { return FillSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimplePointSymbol", function() { return SimplePointSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleLineSymbol", function() { return SimpleLineSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleFillSymbol", function() { return SimpleFillSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleMarkerSymbol", function() { return SimpleMarkerSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleTextSymbol", function() { return SimpleTextSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClusterSymbol", function() { return ClusterSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LetterSymbol", function() { return LetterSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrowSymbol", function() { return ArrowSymbol; });
/* harmony import */ var _util_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/color */ "../dist/util/color.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/**
* 符号基类
* @remarks
* 如按现实世界来抽取对象基类，下述属性不应放在基类
* 但考虑到Canvas的上下文设定，才决定抽取到基类
*/
class Symbol {
    constructor() {
        /**
         * 线宽
         */
        this.lineWidth = 1;
        /**
         * 描边样式
         */
        this.strokeStyle = "#ff0000";
        /**
         * 填充样式
         */
        this.fillStyle = "#ff000088";
    }
}
/**
* 点符号基类
*/
class PointSymbol extends Symbol {
    /**
     * 绘制点（虚函数）
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx, screenX, screenY) { }
    /**
     * 判断鼠标交互位置是否在符号范围内（虚函数）
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) { return false; }
}
/**
* 线符号基类
*/
class LineSymbol extends Symbol {
    /**
     * 绘制线（虚函数）
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx, screen) { }
}
/**
* 面符号基类
* @remarks
* aka 填充符号
*/
class FillSymbol extends Symbol {
    /**
    * 绘制面（虚函数）
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number[][][]} screen - 面对应坐标点的屏幕坐标集合
    */
    draw(ctx, screen) { }
}
/**
* 简单圆点符号
* @remarks
* 最常用的点符号
*/
class SimplePointSymbol extends PointSymbol {
    constructor() {
        super(...arguments);
        /**
        * 圆点半径，像素值
        */
        this.radius = 6;
    }
    /**
     * 绘制点
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx, screenX, screenY) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath(); //Start path
        //keep size
        //地理坐标 转回 屏幕坐标
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) {
        return Math.sqrt((anchorX - screenX) * (anchorX - screenX) + (anchorY - screenY) * (anchorY - screenY)) <= this.radius;
    }
}
/**
* 简单线符号
* @remarks
* 最常用的线符号
*/
class SimpleLineSymbol extends LineSymbol {
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx, screen) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        screen.forEach((point, index) => {
            const screenX = point[0], screenY = point[1];
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
/**
* 简单面符号
* @remarks
* 最常用的面填充符号
*/
class SimpleFillSymbol extends Symbol {
    constructor() {
        super(...arguments);
        /**
        * 重写线宽默认值，基类为1，按需设置，可省略
        */
        this.lineWidth = 2;
    }
    /**
    * 绘制面
    * @remarks
    * 奇偶填充
    * https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fill
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number[][][]} screen - 面对应坐标点的屏幕坐标集合
    */
    draw(ctx, screen) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        ctx.beginPath();
        screen.forEach(ring => {
            ring.forEach((point, index) => {
                const screenX = point[0], screenY = point[1];
                if (index === 0) {
                    ctx.moveTo(screenX, screenY);
                }
                else {
                    ctx.lineTo(screenX, screenY);
                }
            });
        });
        ctx.closePath();
        //奇偶填充
        //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fill
        ctx.fill("evenodd");
        ctx.stroke();
        ctx.restore();
    }
}
/**
* 图标符号
* @remarks
* 常用于POI兴趣点的渲染
*/
class SimpleMarkerSymbol extends PointSymbol {
    constructor() {
        super(...arguments);
        /**
        * 宽
        */
        this.width = 16;
        /**
        * 高
        */
        this.height = 16;
        /**
        * offset，坐标点对应图标的位置
        * 例如，宽16px，高16px，offsetX为-8，offsetY为-8，意味着：
        * 该图标的中心点对应渲染点的坐标。
        */
        this.offsetX = -8;
        /**
        * offset，坐标点对应图标的位置
        * 例如，宽16px，高16px，offsetX为-8，offsetY为-8，意味着：
        * 该图标的中心点对应渲染点的坐标。
        */
        this.offsetY = -8;
    }
    /**
    * 记录是否已完成异步图标加载
    */
    get loaded() {
        return this._loaded;
    }
    /**
    * 异步加载图标
    * @return {Color} 生成随机色带
    */
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
    /**
    * 绘制图标
    * @remarks
    * 注意异步加载
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number} screenX - 屏幕坐标X
    * @param {number} screenY - 屏幕坐标Y
    */
    draw(ctx, screenX, screenY) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded)
                yield this.load();
            if (this.icon) {
                ctx.save();
                const matrix = ctx.getTransform();
                //keep size
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                //请对应参考offset属性的描述内容
                ctx.drawImage(this.icon, screenX + this.offsetX, screenY + this.offsetY, this.width, this.height);
                ctx.restore();
            }
        });
    }
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) {
        return screenX >= (anchorX + this.offsetX) && screenX <= (anchorX + this.offsetX + this.width) && screenY >= (anchorY + this.offsetY) && screenY <= (anchorY + this.offsetY + this.height);
    }
}
/**
* 文本符号
* @remarks
* 常用于文本标注
*/
class SimpleTextSymbol extends Symbol {
    constructor() {
        super(...arguments);
        /**
        * 边框宽
        */
        this.lineWidth = 3;
        /**
        * 边框色
        */
        this.strokeStyle = "#ff0000"; //#ffffff
        /**
        * 填充色
        */
        this.fillStyle = "#ffffff"; //#ffffff
        /**
        * X偏移
        */
        this.offsetX = 0;
        /**
        * Y偏移
        */
        this.offsetY = 1;
        /**
        * 周边留白
        */
        this.padding = 5;
        /**
        * 字体颜色
        */
        this.fontColor = "#ff0000";
        /**
        * 字体大小
        */
        this.fontSize = 12;
        /**
        * 字体
        */
        this.fontFamily = "YaHei";
        /**
        * 字体粗细
        */
        this.fontWeight = "Bold";
    }
}
/**
* 聚合符号
* @remarks
* 限制用于点图层
*/
class ClusterSymbol extends PointSymbol {
    /**
    * 创建聚合符号
    * @param {number} count - 聚合数量
    */
    constructor(count) {
        super();
        /**
        * 聚合数量
        */
        this._count = 2;
        /**
        * 聚合符号的默认半径
        */
        this.radius = 10;
        /**
        * 重写描边样式
        */
        this.strokeStyle = "#ffffff"; //#ff0000
        /**
        * 聚合外圈填充样式
        */
        this.outerFillStyle = "#ffffff"; //#ff0000
        /**
        * 聚合数量字体颜色
        */
        this.fontColor = "#ffffff";
        /**
        * 聚合数量字体
        */
        this.fontFamily = "YaHei";
        /**
        * 聚合数量字体粗细
        */
        this.fontWeight = "Bold";
        this._count = count;
    }
    /**
    * 聚合数量文本
    * @remarks
    * 大于99，标记为99+
    */
    get text() {
        return this._count <= 99 ? this._count.toString() : "99+";
    }
    /**
    * 内圈半径
    */
    get inner() {
        return this._count <= 15 ? this.radius + this._count : this.radius + 15;
    }
    /**
    * 外圈半径
    */
    get outer() {
        return this.inner + 4;
    }
    /**
    * 字体随数量递增，同时控制为非无限递增
    */
    get fontSize() {
        if (this._count < 10) {
            return 12;
        }
        else if (this._count >= 10 && this._count < 30) {
            return 14;
        }
        else if (this._count >= 30 && this._count < 50) {
            return 16;
        }
        else if (this._count >= 30 && this._count < 50) {
            return 18;
        }
        else if (this._count > 50) {
            return 20;
        }
    }
    /**
   * 聚合的内圈填充样式
   * @remarks
   * 采用色带，色带可自定义扩展
   */
    get innerFillStyle() {
        //const colors = Color.ramp(new Color(0, 255, 0), new Color(255,0,0), 16);
        //const colors = Color.ramp(new Color(22,198,227), new Color(255, 0, 255), 16);
        const colors = _util_color__WEBPACK_IMPORTED_MODULE_0__["Color"].ramp(new _util_color__WEBPACK_IMPORTED_MODULE_0__["Color"](25, 202, 173), new _util_color__WEBPACK_IMPORTED_MODULE_0__["Color"](244, 96, 108), 16);
        return colors[this._count <= 15 ? this._count : 15].toString();
    }
    /**
    * 绘制聚合符号
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number} screenX - 屏幕坐标X
    * @param {number} screenY - 屏幕坐标Y
    */
    draw(ctx, screenX, screenY) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.outerFillStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath(); //Start path
        //keep size 画外圈
        ctx.arc(screenX, screenY, this.outer, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = this.innerFillStyle;
        ctx.beginPath(); //Start path
        //keep size 画内圈
        ctx.arc(screenX, screenY, this.inner, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = this.fontColor;
        ctx.font = this.fontSize + "px/1 " + this.fontFamily + " " + this.fontWeight;
        ctx.fillText(this.text, screenX, screenY);
        ctx.restore();
    }
}
/**
* 字符符号
* @remarks
* 中英文皆可，注意控制长度，推荐单个字符
*/
class LetterSymbol extends PointSymbol {
    constructor() {
        super(...arguments);
        /**
        * 外圈半径
        */
        this.radius = 10;
        /**
        * 字符，中英文皆可，推荐单个字符
        */
        this.letter = "";
        /**
        * 字体颜色
        */
        this.fontColor = "#ff0000";
        /**
        * 字体大小
        */
        this.fontSize = 12;
        /**
        * 字体
        */
        this.fontFamily = "YaHei";
        /**
        * 字体粗细
        */
        this.fontWeight = "Bold";
    }
    /**
     * 绘制字符符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx, screenX, screenY) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath(); //Start path
        //keep size
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //绘制外圈
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = this.fontColor;
        ctx.font = this.fontSize + "px/1 " + this.fontFamily + " " + this.fontWeight;
        //绘制字符
        ctx.fillText(this.letter, screenX, screenY);
        ctx.restore();
    }
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) {
        return Math.sqrt((anchorX - screenX) * (anchorX - screenX) + (anchorY - screenY) * (anchorY - screenY)) <= this.radius;
    }
}
/**
* 箭头符号
*/
class ArrowSymbol extends Symbol {
    constructor() {
        super(...arguments);
        /**
        * 线宽
        */
        this.lineWidth = 2;
        /**
         * 决定绘制箭头的最小线长
         * @remarks 屏幕坐标，单位pixel
         * 默认 >50pixels will draw arrow
         */
        this.minLength = 50;
        /**
         * 箭翼长度
         */
        this.arrowLength = 10;
        /**
         * 箭翼夹角
         * @remarks 默认 angle 30 = Math.PI / 6
         */
        this.arrowAngle = Math.PI / 6;
    }
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx, screen) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        screen.forEach((point, index) => {
            const screenX = point[0], screenY = point[1];
            if (index === 0) {
                ctx.moveTo(screenX, screenY);
            }
            else {
                ctx.lineTo(screenX, screenY);
            }
        });
        ctx.stroke();
        //已知 起点和终点  求沿线距起点定长的点
        const _getPointAlongLine = (p1, p2, d) => {
            //line length
            let l = Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
            let t = d / l;
            return [(1 - t) * p1[0] + t * p2[0], (1 - t) * p1[1] + t * p2[1]];
        };
        //已知 起点 y = kx + b   求沿线距起点定长的点 两个点
        const _getPointAlongLine2 = (k, b, p, d) => {
            let x0 = p[0] + Math.sqrt((d * d) / (k * k + 1)), x1 = p[0] - Math.sqrt((d * d) / (k * k + 1));
            return [[x0, k * x0 + b], [x1, k * x1 + b]];
        };
        screen.reduce((prev, cur) => {
            if (prev) {
                const length = Math.sqrt((cur[0] - prev[0]) * (cur[0] - prev[0]) + (cur[1] - prev[1]) * (cur[1] - prev[1]));
                if (length >= this.minLength) {
                    //中点 即箭头
                    const [middleX, middleY] = [(prev[0] + cur[0]) / 2, (prev[1] + cur[1]) / 2];
                    //箭尾垂线的垂足
                    const [footX, footY] = _getPointAlongLine([middleX, middleY], prev, Math.cos(this.arrowAngle) * this.arrowLength);
                    const k = (cur[1] - prev[1]) / (cur[0] - prev[0]);
                    // 1/k 垂线
                    const points = _getPointAlongLine2(-1 / k, footY - footX * -1 / k, [footX, footY], Math.sin(this.arrowAngle) * this.arrowLength);
                    //两点
                    points.forEach(point => {
                        ctx.beginPath();
                        ctx.moveTo(middleX, middleY);
                        ctx.lineTo(point[0], point[1]);
                        ctx.stroke();
                    });
                }
                return cur;
            }
            else {
                return cur;
            }
        });
        ctx.restore();
    }
}


/***/ }),

/***/ "../dist/tile.js":
/*!***********************!*\
  !*** ../dist/tile.js ***!
  \***********************/
/*! exports provided: Tile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tile", function() { return Tile; });
/* harmony import */ var _util_subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/subject */ "../dist/util/subject.js");

/**
 * 动画效果的管理器
 * 已内置于map，可通过map的接口进行添加删除的维护操作
 */
class Tile extends _util_subject__WEBPACK_IMPORTED_MODULE_0__["Subject"] {
    /**
     * 创建Animator
     * 不应自主创建，map内部创建
     * @param {Map} map - 地图容器
     */
    constructor(map) {
        super(["mouseover", "mouseout"]); //when mouseover feature
        this._map = map;
        const container = map.container;
        //create canvas
        this._container = document.createElement("div");
        this._container.style.cssText = "position: absolute; height: 100%; width: 100%; z-index: 80";
        container.appendChild(this._container);
        this._extentChange = this._extentChange.bind(this);
        this._map.on("extent", this._extentChange);
    }
    /**
     * 图层url
     */
    get url() {
        return this._url;
    }
    /**
     * 图层url
     */
    set url(value) {
        this._url = value;
    }
    //与主视图同步
    _extentChange(event) {
        this.redraw();
    }
    /**
     * 重绘
     */
    redraw() {
        if (!this._url)
            return;
        const lngLat2Tile = (lng, lat, z) => {
            let tileX = Math.floor((lng + 180) / 360 * Math.pow(2, z));
            let tileY = Math.floor((1 / 2 - (Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180))) / (2 * Math.PI)) * Math.pow(2, z));
            return [tileX, tileY];
        };
        const lngLat2Pixel = (lng, lat, z) => {
            let pixelX = Math.floor(((lng + 180) / 360 * Math.pow(2, z) * 256) % 256);
            let pixelY = Math.floor(((1 - (Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180))) / (2 * Math.PI)) * Math.pow(2, z) * 256) % 256);
            return [pixelX, pixelY];
        };
        const getUrl = (url, x, y, z) => {
            return url.replace("{x}", x).replace("{y}", y).replace("{z}", z);
        };
        const projection = this._map.projection;
        const extent = this._map.extent;
        const zoom = this._map.zoom;
        const [lng1, lat1] = projection.unproject([extent.xmin, extent.ymax]);
        const [lng2, lat2] = projection.unproject([extent.xmax, extent.ymin]);
        const [tileMinX, tileMinY] = lngLat2Tile(lng1, lat1, zoom);
        const [tileMaxX, tileMaxY] = lngLat2Tile(lng2, lat2, zoom);
        const [pixelX, pixelY] = lngLat2Pixel(lng1, lat1, zoom);
        this._container.innerHTML = "";
        for (let x = tileMinX; x <= tileMaxX; x++) {
            for (let y = tileMinY; y <= tileMaxY; y++) {
                const url = getUrl(this._url, x, y, zoom);
                let tile = document.createElement('img');
                /*
                 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
                 http://www.w3.org/TR/WCAG20-TECHS/H67
                */
                tile.alt = '';
                /*
                 Set role="presentation" to force screen readers to ignore this
                 https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
                */
                tile.setAttribute('role', 'presentation');
                tile.style.width = '256px';
                tile.style.height = '256px';
                tile.style.position = 'absolute';
                tile.src = url;
                tile.style.left = (-pixelX + (x - tileMinX) * 256) + 'px';
                tile.style.top = (-pixelY + (y - tileMinY) * 256) + 'px';
                this._container.appendChild(tile);
            }
        }
    }
    /**
     * 销毁
     */
    destroy() {
        this._map.off("extent", this._extentChange);
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
/**
 * 边界类，用在包络矩形，以及投影的平面坐标边界
 * @remarks
 * 考虑此处代码影响较多内容，故暂不大变动，沿用设计时的定义：
 * 屏幕坐标系的设定：x正方向为自左向右，y正方向为自上向下，因此与常规笛卡尔坐标系中的y正方向相反，请重点注意
 * 故，如传入常规笛卡尔坐标系的坐标，请将ymin与ymax颠倒(即y坐标的最大值传给ymin，最小值传给ymax)，以便于程序设置yscale为-1
 * 当然，如表示的是屏幕坐标范围与边界，正常传入：ymin最小值，ymax最大值。
 */
class Bound {
    /**
     * 创建包络矩形
     * @param {number} xmin - x方向靠左极值
     * @param {number} ymin - y方向上方极值
     * @param {number} xmax - x方向靠右极值
     * @param {number} ymax - y方向下方极值
     */
    constructor(xmin, ymin, xmax, ymax) {
        //+1代表 x方向为自左向右，-1则反之
        this._xscale = 1;
        //+1代表 y方向为自上向下，-1则反之
        this._yscale = 1;
        this._xmin = Math.min(xmin, xmax);
        this._ymin = Math.min(ymin, ymax);
        this._xmax = Math.max(xmin, xmax);
        this._ymax = Math.max(ymin, ymax);
        this._xscale = xmin <= xmax ? 1 : -1;
        this._yscale = ymin <= ymax ? 1 : -1;
    }
    /**
     * x方向最小值（应为靠左极值）
     * @return {number} x方向靠左极值
     */
    get xmin() {
        return this._xmin;
    }
    /**
     * y方向最小值（应为上方极值）
     * @return {number} y方向上方极值
     */
    get ymin() {
        return this._ymin;
    }
    /**
     * x方向最大值（应为靠右极值）
     * @return {number} x方向靠右极值
     */
    get xmax() {
        return this._xmax;
    }
    /**
    * y方向最大值（应为下方极值）
    * @return {number} y方向下方极值
    */
    get ymax() {
        return this._ymax;
    }
    /**
     * +1代表 x方向为自左向右，-1则反之
     * @return {number} x方向
     */
    get xscale() {
        return this._xscale;
    }
    /**
     * +1代表 y方向为自上向下，-1则反之
     * @return {number} y方向
     */
    get yscale() {
        return this._yscale;
    }
    /**
     * 包络矩形中心点坐标数组
     * @return {number[]} 中心点坐标数组[x,y]
     */
    getCenter() {
        return [(this._xmin + this._xmax) / 2, (this._ymin + this._ymax) / 2];
    }
    /**
     * 是否交叉叠盖
     * @param {Bound} bound - 交叉叠盖检测对象
     * @return {boolean} 是否交叉叠盖
     */
    intersect(bound) {
        return (bound.xmax >= this._xmin) && (bound.xmin <= this._xmax) && (bound.ymax >= this._ymin) && (bound.ymin <= this._ymax);
    }
    /**
     * 缩放整个边界
     * @param {number} s - 缩放倍数
     */
    scale(s) {
        this._xmin = this._xmin - (s - 1) * (this._xmax - this._xmin) / 2;
        this._xmax = this._xmax + (s - 1) * (this._xmax - this._xmin) / 2;
        this._ymin = this._ymin - (s - 1) * (this._ymax - this._ymin) / 2;
        this._ymax = this._ymax + (s - 1) * (this._ymax - this._ymin) / 2;
    }
    /**
     * 缓冲整个边界，类似拓宽
     * @param {number} size - 拓宽相应尺寸
     */
    buffer(size) {
        this._xmin -= size;
        this._ymin -= size;
        this._xmax += size;
        this._ymax += size;
    }
}


/***/ }),

/***/ "../dist/util/color.js":
/*!*****************************!*\
  !*** ../dist/util/color.js ***!
  \*****************************/
/*! exports provided: Color */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return Color; });
/**
 * 颜色工具类
 * @remarks
 * 此处有太多可扩展内容，如更优雅的生成色带，给色带更多的配置项等等
 * 但由于相关内容，并非GIS API的关注重点，故未花太多精力扩展此内容
 * 各位可根据项目需求，自行发挥，达到更优雅美观的颜色渲染效果。
 * TODO: a lot of things to be done
 */
class Color {
    /**
     * 创建颜色
     * @param {number} r - red
     * @param {number} g - green
     * @param {number} b - blue
     * @param {number} a - alpha
     */
    constructor(r, g, b, a = 1) {
        /**
         * alpha
         */
        this.a = 1;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    /**
    * 输出rgba值
    * @return {string} rgba
    */
    toString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
    /**
     * 16进制表示法颜色 转十进制 R G B
     * @param {string} hex - 十六进制 #ffffff
     * @return {string} 十进制 R G B
     */
    static fromHex(hex) {
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
        hex = hex.toLowerCase();
        if (hex && reg.test(hex)) {
            //处理三位的颜色值
            if (hex.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += hex.slice(i, i + 1).concat(hex.slice(i, i + 1));
                }
                hex = sColorNew;
            }
            //处理六位的颜色值
            if (hex.length === 7) {
                hex += "ff";
            }
            let sColorChange = [];
            for (let i = 1; i < 9; i += 2) {
                sColorChange.push(parseInt("0x" + hex.slice(i, i + 2)));
            }
            return new Color(sColorChange[0], sColorChange[1], sColorChange[2], sColorChange[3] / 255);
        }
    }
    /**
     * 生成随机色带
     * @param {Color} start - 色带起始色
     * @param {Color} end - 色带终止色
     * @param {number} count - 随机颜色数，默认值10个
     * @return {Color} 生成随机色带
     */
    static ramp(start, end, count = 10) {
        const colors = [];
        for (let i = 0; i < count; i += 1) {
            colors.push(new Color((end.r - start.r) * i / count + start.r, (end.g - start.g) * i / count + start.g, (end.b - start.b) * i / count + start.b, (end.a - start.a) * i / count + start.a));
        }
        return colors;
    }
    /**
     * 生成随机色
     * @return {Color} 生成随机色
     */
    static random() {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
}


/***/ }),

/***/ "../dist/util/subject.js":
/*!*******************************!*\
  !*** ../dist/util/subject.js ***!
  \*******************************/
/*! exports provided: Subject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Subject", function() { return Subject; });
/**
 * 可订阅对象
 * @remarks
 * 事件监听者列表
 * {
 *    click: [clickhander1, clickhandler2, ...]
 *    mousemove: [mousemovehander1, mousemovehandler2, ...]
 * }
 */
class Subject {
    /**
     * 事件名称数组
     * ["click", "mousemove"]
     * @param {string[]} events - 事件名称数组
     */
    constructor(events) {
        this._handlers = {};
        events.forEach(event => {
            this._handlers[event] = []; //handlers array
        });
    }
    /**
     * 事件注册监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    on(event, handler) {
        this._handlers[event].push(handler);
    }
    /**
     * 事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event, handler) {
        if (Array.isArray(this._handlers[event])) {
            const index = this._handlers[event].findIndex(item => item === handler);
            index != -1 && this._handlers[event].splice(index, 1);
        }
    }
    /**
     * 激发事件
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event, param) {
        this._handlers[event].forEach(handler => handler(param));
    }
}


/***/ }),

/***/ "./demo.js":
/*!*****************!*\
  !*** ./demo.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dist__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dist */ "../dist/index.js");


window.load = async () => {
    const map = new _dist__WEBPACK_IMPORTED_MODULE_0__["Map"]("foo");
    //map.setTileUrl("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png");
    map.setTileUrl("http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7");
    map.setView([116.397411,39.909186], 12);
    const marker = new _dist__WEBPACK_IMPORTED_MODULE_0__["SimpleMarkerSymbol"]();
    marker.width = 32;
    marker.height = 32;
    marker.offsetX = -16;
    marker.offsetY = -32;
    marker.url = "assets/img/marker.svg";
    await marker.load();
    const point = new _dist__WEBPACK_IMPORTED_MODULE_0__["Point"](116.397411,39.909186);
    const graphic = new _dist__WEBPACK_IMPORTED_MODULE_0__["Graphic"](point, marker);
    map.addGraphic(graphic);

}

//cause typescript tsc forget js suffix for geometry.js

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map