
import {Geometry} from "./geometry";
//面
export class Polygon extends Geometry{
    //[ring[point[xy]]]
    //such as [[[1,1],[2,2],[1,2]], [[1.5,1.5],[1.9,1.9],[1.5,1.9]]]

    private _coordinates: number[][][];

    constructor(coordinates: number[][][]) {
        super();
        this._coordinates = coordinates;
    };

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        this._coordinates.forEach( ring => {
            ring.forEach( (point,index) => {
                let x = point[0], y = point[1];
                if (index === 0){
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
        });
        ctx.closePath();
        ctx.fill("evenodd");
        ctx.stroke();
        ctx.restore();
    }
}
