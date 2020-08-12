import { Geometry } from "./geometry";
import { Bound } from "../util/bound";
//点
export class Point extends Geometry {
    constructor(lng, lat) {
        super();
        this._lng = lng;
        this._lat = lat;
    }
    get bound() {
        return this._bound;
    }
    ;
    //need interface to separate dependence
    addTo(map) {
        this._projection = map.projection;
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        map.addGeometry(this);
    }
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.beginPath(); //Start path
        const matrix = ctx.getTransform();
        //keep radius size
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.arc((matrix.a * this._x + matrix.e), (matrix.d * this._y + matrix.f), Point.RADIUS, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    ;
}
Point.RADIUS = 10; //10px
