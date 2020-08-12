import {Geometry} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
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

    constructor(lng: number, lat: number) {
        super();
        this._lng = lng;
        this._lat = lat;
    };

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

    project(projection: Projection) {
        this._projection = projection;
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        this._projected = true;
    }

    async draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: Symbol = new SimplePointSymbol()) {
        if (!this._projected) this.project(projection);
        if (!extent.intersect(this._bound)) return;
        ctx.save();
        if (symbol instanceof SimplePointSymbol) {
            ctx.strokeStyle = (symbol as SimplePointSymbol).strokeStyle;
            ctx.fillStyle = (symbol as SimplePointSymbol).fillStyle;
            ctx.lineWidth = (symbol as SimplePointSymbol).lineWidth;
            ctx.beginPath(); //Start path
            const matrix = (ctx as any).getTransform();
            //keep size
            ctx.setTransform(1,0,0,1,0,0);
            ctx.arc((matrix.a * this._x + matrix.e), (matrix.d * this._y + matrix.f), (symbol as SimplePointSymbol).radius, 0, Math.PI * 2, true);

            ctx.fill();
            ctx.stroke();
        } else if (symbol instanceof SimpleMarkerSymbol) {
            const marker: SimpleMarkerSymbol = symbol;
            if (!marker.loaded) await marker.load();
            if (marker.icon) {
                const matrix = (ctx as any).getTransform();
                //keep size
                ctx.setTransform(1,0,0,1,0,0);
                ctx.drawImage(marker.icon, (matrix.a * this._x + matrix.e) - marker.offsetX, (matrix.d * this._y + matrix.f) - marker.offsetY, marker.width, marker.height);
            }
        }
        ctx.restore();
    };

}