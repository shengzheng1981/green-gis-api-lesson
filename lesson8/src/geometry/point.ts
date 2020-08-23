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

    static RADIUS: number = 10; //10px
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

    project(projection: Projection) {
        this._projection = projection;
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        this._projected = true;
    }

    async draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: PointSymbol = new SimplePointSymbol()) {
        if (!this._projected) this.project(projection);
        if (!extent.intersect(this._bound)) return;
        const matrix = (ctx as any).getTransform();
        this._screenX = (matrix.a * this._x + matrix.e);
        this._screenY = (matrix.d * this._y + matrix.f);
        this._symbol = symbol;
        this._symbol.draw(ctx, this._screenX, this._screenY);
        /*if (symbol instanceof SimplePointSymbol) {
            ctx.save();
            ctx.strokeStyle = (symbol as SimplePointSymbol).strokeStyle;
            ctx.fillStyle = (symbol as SimplePointSymbol).fillStyle;
            ctx.lineWidth = (symbol as SimplePointSymbol).lineWidth;
            ctx.beginPath(); //Start path
            //keep size
            //地理坐标 转回 屏幕坐标
            ctx.setTransform(1,0,0,1,0,0);
            ctx.arc(this._screenX, this._screenY, (symbol as SimplePointSymbol).radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        } else if (symbol instanceof SimpleMarkerSymbol) {
            const marker: SimpleMarkerSymbol = symbol;
            if (!marker.loaded) await marker.load();
            if (marker.icon) {
                ctx.save();
                const matrix = (ctx as any).getTransform();
                //keep size
                ctx.setTransform(1,0,0,1,0,0);
                ctx.drawImage(marker.icon, this._screenX + marker.offsetX, this._screenY + marker.offsetY, marker.width, marker.height);
                ctx.restore();
            }
        } */
    };

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
        /*if (this._symbol instanceof SimplePointSymbol) {
            return Math.sqrt((this._screenX - screenX) *  (this._screenX - screenX) +  (this._screenY - screenY) *  (this._screenY - screenY)) <= (this._symbol as SimplePointSymbol).radius;
        } else if (this._symbol instanceof SimpleMarkerSymbol) {
            return screenX >= (this._screenX + this._symbol.offsetX) &&  screenX <= (this._screenX + this._symbol.offsetX + this._symbol.width) && screenY >= (this._screenY + this._symbol.offsetY) &&  screenY <= (this._screenY + this._symbol.offsetY + this._symbol.height);
        } else if (this._symbol instanceof LetterSymbol) {
            return Math.sqrt((this._screenX - screenX) *  (this._screenX - screenX) +  (this._screenY - screenY) *  (this._screenY - screenY)) <= (this._symbol as LetterSymbol).radius;
        } else if (this._symbol instanceof VertexSymbol) {
            return screenX >= (this._screenX - this._symbol.size / 2) &&  screenX <= (this._screenX + this._symbol.size / 2) && screenY >= (this._screenY - this._symbol.size / 2) &&  screenY <= (this._screenY + this._symbol.size / 2);
        }*/
        return this._symbol ? this._symbol.contain(this._screenX, this._screenY, screenX, screenY) : false;
    }

}