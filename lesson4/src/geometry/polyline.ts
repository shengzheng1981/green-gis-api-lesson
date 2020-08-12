import {Geometry} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    SimpleLineSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";
//线
export class Polyline extends Geometry{
    //经纬度
    private _lnglats: number[][];
    //平面坐标
    private _coordinates: number[][];

    constructor(lnglats: number[][]) {
        super();
        this._lnglats = lnglats;
    };

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

    project(projection: Projection) {
        this._projection = projection;
        this._coordinates = this._lnglats.map( (point: any) => this._projection.project(point));

        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach( point => {
            xmin = Math.min(xmin, point[0]);
            ymin = Math.min(ymin, point[1]);
            xmax = Math.max(xmax, point[0]);
            ymax = Math.max(ymax, point[1]);
        });
        this._bound = new Bound(xmin, ymin, xmax, ymax);
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: Symbol = new SimpleLineSymbol()) {
        if (!this._projected) this.project(projection);
        if (!extent.intersect(this._bound)) return;
        ctx.save();
        ctx.strokeStyle = (symbol as SimpleLineSymbol).strokeStyle;
        ctx.lineWidth = (symbol as SimpleLineSymbol).lineWidth;
        const matrix = (ctx as any).getTransform();
        //keep lineWidth
        ctx.setTransform(1,0,0,1,0,0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        ctx.beginPath();
        this._coordinates.forEach( (point: any,index) => {
            const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
            if (index === 0){
                ctx.moveTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        });
        ctx.stroke();
        ctx.restore();
    }


}