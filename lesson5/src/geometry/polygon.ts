
import {Geometry} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    SimpleFillSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";
//面
export class Polygon extends Geometry{
    //such as [[1,1],[2,2],[1,2]]
    //[ring[point[xy]]]
    //such as [[[1,1],[2,2],[1,2]], [[1.5,1.5],[1.9,1.9],[1.5,1.9]]]
    //no ring
    //经纬度
    private _lnglats: number[][][];
    //平面坐标
    private _coordinates: number[][][];

    constructor(lnglats: number[][][]) {
        super();
        this._lnglats = lnglats;
    };

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
    project(projection: Projection) {
        this._projection = projection;
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
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: Symbol = new SimpleFillSymbol()) {
        if (!this._projected) this.project(projection);
        if (!extent.intersect(this._bound)) return;
        ctx.save();
        ctx.strokeStyle = (symbol as SimpleFillSymbol).strokeStyle;
        ctx.fillStyle = (symbol as SimpleFillSymbol).fillStyle;
        ctx.lineWidth = (symbol as SimpleFillSymbol).lineWidth;

        const matrix = (ctx as any).getTransform();
        //keep lineWidth
        ctx.setTransform(1,0,0,1,0,0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        ctx.beginPath();
        this._coordinates.forEach( ring => {
            ring.forEach((point: any,index) => {
                const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
                if (index === 0){
                    ctx.moveTo(screenX, screenY);
                } else {
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
