import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { SimpleFillSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
//面
export class Polygon extends Geometry {
    constructor(lnglats) {
        super();
        this._lnglats = lnglats;
    }
    ;
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
        this._bound = new Bound(xmin, ymin, xmax, ymax);
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, symbol = new SimpleFillSymbol()) {
        if (!this._projected)
            this.project(projection);
        if (!extent.intersect(this._bound))
            return;
        const matrix = ctx.getTransform();
        this._screen = this._coordinates.map(ring => {
            return ring.map((point, index) => {
                const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
                return [screenX, screenY];
            });
        });
        symbol.draw(ctx, this._screen);
        /*ctx.save();
        ctx.strokeStyle = (symbol as SimpleFillSymbol).strokeStyle;
        ctx.fillStyle = (symbol as SimpleFillSymbol).fillStyle;
        ctx.lineWidth = (symbol as SimpleFillSymbol).lineWidth;
        //keep lineWidth
        ctx.setTransform(1,0,0,1,0,0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        this._screen = [];
        ctx.beginPath();
        this._coordinates.forEach( ring => {
            const temp = [];
            this._screen.push(temp);
            ring.forEach((point: any,index) => {
                const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
                if (index === 0){
                    ctx.moveTo(screenX, screenY);
                } else {
                    ctx.lineTo(screenX, screenY);
                }
                temp.push([screenX, screenY]);
            });
        });
        ctx.closePath();
        ctx.fill("evenodd");
        ctx.stroke();
        ctx.restore();*/
    }
    //from Leaflet
    getCenter(type = CoordinateType.Latlng, projection = new WebMercator()) {
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
        if (type === CoordinateType.Latlng) {
            return projection.unproject(center);
        }
        else {
            return center;
        }
    }
}
