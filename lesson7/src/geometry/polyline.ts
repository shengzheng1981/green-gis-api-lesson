import {Geometry, CoordinateType} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    LineSymbol,
    SimpleLineSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";
//线
export class Polyline extends Geometry{

    static TOLERANCE: number = 4; //screen pixel
    private _tolerance: number = 4; //TOLERANCE + symbol.lineWidth

    //经纬度
    private _lnglats: number[][];
    //平面坐标
    private _coordinates: number[][];
    //屏幕坐标
    private _screen: number[][];

    constructor(lnglats: number[][]) {
        super();
        this._lnglats = lnglats;
    };

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

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: LineSymbol = new SimpleLineSymbol()) {
        if (!this._projected) this.project(projection);
        if (!extent.intersect(this._bound)) return;
        this._tolerance = Polyline.TOLERANCE + symbol.lineWidth;
        const matrix = (ctx as any).getTransform();
        this._screen = this._coordinates.map( (point: any,index) => {
            const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
            return [screenX, screenY];
        });
        symbol.draw(ctx, this._screen);
        /* ctx.save();
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
        ctx.restore(); */
    }

    //from Leaflet
    getCenter(type: CoordinateType = CoordinateType.Latlng, projection: Projection = new WebMercator()) {
        if (!this._projected) this.project(projection);
        let i, halfDist, segDist, dist, p1, p2, ratio,
            points = this._coordinates,
            len = points.length;

        if (!len) { return null; }

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

        if (type === CoordinateType.Latlng) {
            return projection.unproject(center);
        } else {
            return center;
        }
    }

}