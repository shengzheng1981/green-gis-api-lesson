import {Geometry, CoordinateType} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    PointSymbol,
    SimpleMarkerSymbol,
    SimplePointSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";

//点
export class Point extends Geometry{

    //经纬度
    private _lng: number;
    private _lat: number;
    //平面坐标
    private _x: number;
    private _y: number;
    //屏幕坐标
    private _screenX: number;
    private _screenY: number;
    //记录用于判断鼠标是否进入交互范围
    private _symbol: PointSymbol;

    constructor(lng: number, lat: number) {
        super();
        this._lng = lng;
        this._lat = lat;
    };

    //投影变换
    project(projection: Projection) {
        this._projection = projection;
        //经纬度转平面坐标
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance.
        //包络矩形，当前是点，可考虑加入buffer或tolerance
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        this._projected = true;
    }

    //绘制点
    async draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: PointSymbol = new SimplePointSymbol()) {
        //如第一次绘制，没有经过投影，则先完成投影，以后可跳过
        if (!this._projected) this.project(projection);
        //再判断是否在可视范围内
        if (!extent.intersect(this._bound)) return;
        //获得屏幕坐标，以便根据symbol来进行绘制
        //TODO: cache screenXY & symbol for redraw.
        const matrix = (ctx as any).getTransform();
        this._screenX = (matrix.a * this._x + matrix.e);
        this._screenY = (matrix.d * this._y + matrix.f);
        this._symbol = symbol;
        this._symbol.draw(ctx, this._screenX, this._screenY);
    };

    //获取中心点
    getCenter(type: CoordinateType = CoordinateType.Latlng, projection: Projection = new WebMercator()) {
        if (!this._projected) this.project(projection);
        if (type === CoordinateType.Latlng) {
            return [this._lng, this._lat];
        } else {
            return [this._x, this._y];
        }
    }

    //由于点是0维，主要根据渲染的符号大小来判断传入坐标是否落到点内
    contain(screenX: number, screenY: number): boolean {
        return this._symbol ? this._symbol.contain(this._screenX, this._screenY, screenX, screenY) : false;
    }

}