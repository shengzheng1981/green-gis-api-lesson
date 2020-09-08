var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { SimplePointSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
/**
 * 点
 */
export class Point extends Geometry {
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
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        this._projected = true;
    }
    /**
     * 绘制点
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx, projection = new WebMercator(), extent = projection.bound, symbol = new SimplePointSymbol()) {
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
    getCenter(type = CoordinateType.Latlng, projection = new WebMercator()) {
        if (!this._projected)
            this.project(projection);
        if (type === CoordinateType.Latlng) {
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
