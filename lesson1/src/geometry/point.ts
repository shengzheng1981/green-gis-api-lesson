import {Geometry} from "./geometry";

//点
export class Point extends Geometry{
    static RADIUS: number = 10;  //半径

    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        super();
        this._x = x;
        this._y = y;
    };

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        //画圆
        ctx.arc(this._x, this._y, Point.RADIUS, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}