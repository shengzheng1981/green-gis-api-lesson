import {Geometry} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
//点
export class Point extends Geometry{

    static RADIUS: number = 10; //10px
    //经纬度
    private _lng: number;
    private _lat: number;
    //平面坐标
    private _x: number;
    private _y: number;

    private _projection: Projection;
    private _bound: Bound;

    get bound(): Bound {
        return this._bound;
    }

    constructor(lng: number, lat: number) {
        super();
        this._lng = lng;
        this._lat = lat;
    };

    //need interface to separate dependence
    addTo(map) {
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
    };

}