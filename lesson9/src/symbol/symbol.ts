import {Color} from "../util/color";
 /**
 * 符号基类
 * @remarks
 * 如按现实世界来抽取对象基类，下述属性不应放在基类
 * 但考虑到Canvas的上下文设定，才决定抽取到基类
 */
export class Symbol {
    //线宽
    public lineWidth: number = 1;
    //描边样式
    public strokeStyle: string = "#ff0000"; 
    //填充样式
    public fillStyle: string = "#ff000088";
}

 /**
 * 点符号基类
 */
export class PointSymbol extends Symbol {
    //绘制点
    draw(ctx: CanvasRenderingContext2D, screenX, screenY) {}
    //判断点是否在符号范围内
    contain(anchorX, anchorY, screenX, screenY): boolean { return false; }
}
 /**
 * 线符号基类
 */
export class LineSymbol extends Symbol {
    //绘制线
    draw(ctx: CanvasRenderingContext2D, screen: number[][]) {}
}
 /**
 * 面符号基类
 * @remarks
 * aka 填充符号
 */
export class FillSymbol extends Symbol {
    //绘制面
    draw(ctx: CanvasRenderingContext2D, screen: number[][][]) {}
}
 /**
 * 简单圆点符号
 * @remarks
 * 最常用的点符号
 */
export class SimplePointSymbol extends PointSymbol {
    //圆点半径，像素值
    public radius: number = 6;
    //绘制点
    draw(ctx: CanvasRenderingContext2D, screenX, screenY) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath(); //Start path
        //keep size
        //地理坐标 转回 屏幕坐标
        ctx.setTransform(1,0,0,1,0,0);
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    //判断点是否在符号范围内
    contain(anchorX, anchorY, screenX, screenY) {
        return Math.sqrt((anchorX - screenX) *  (anchorX - screenX) +  (anchorY - screenY) *  (anchorY - screenY)) <= this.radius;
    }
}
 /**
 * 简单线符号
 * @remarks
 * 最常用的线符号
 */
export class SimpleLineSymbol extends LineSymbol {
    //绘制线
    draw(ctx: CanvasRenderingContext2D, screen: number[][]) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1,0,0,1,0,0);
        ctx.beginPath();
        screen.forEach( (point: any,index) => {
            const screenX = point[0], screenY = point[1];
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
 /**
 * 简单面符号
 * @remarks
 * 最常用的线符号
 */
export class SimpleFillSymbol extends Symbol {
    //重写线宽默认值，基类为1，按需设置，可省略
    public lineWidth: number = 2;
    //绘制面
    draw(ctx: CanvasRenderingContext2D, screen: number[][][]) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1,0,0,1,0,0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        ctx.beginPath();
        screen.forEach( ring => {
            ring.forEach((point: any,index) => {
                const screenX = point[0], screenY = point[1];
                if (index === 0){
                    ctx.moveTo(screenX, screenY);
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            });
        });
        ctx.closePath();
        //奇偶填充
        //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fill
        ctx.fill("evenodd");
        ctx.stroke();
        ctx.restore();
    }
}
 /**
 * 图标符号
 * @remarks
 * 常用于POI兴趣点的渲染
 */
export class SimpleMarkerSymbol extends PointSymbol {
    //宽
    public width: number = 16;
    //高
    public height: number = 16;
    //offset，坐标点对应图标的位置
    //例如，宽16px，高16px，offsetX为-8，offsetY为-8，意味着：
    //该图标的中心点对应渲染点的坐标。
    public offsetX: number = -8;
    public offsetY: number = -8;
    //图标
    public icon: ImageBitmap;
    //图标url
    public url: string;
    //记录是否已完成异步图标加载
    private _loaded: boolean;
    get loaded(): boolean {
        return this._loaded;
    }
    //异步加载图标
    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                createImageBitmap(img).then(icon => {
                    this.icon = icon;
                    this._loaded = true;
                    resolve(icon);
                },err => reject(err));
            };
            img.onerror = reject;
            img.src = this.url;
        })
    }
    //绘制图标
    async draw(ctx: CanvasRenderingContext2D, screenX, screenY) {
        if (!this.loaded) await this.load();
        if (this.icon) {
            ctx.save();
            const matrix = (ctx as any).getTransform();
            //keep size
            ctx.setTransform(1,0,0,1,0,0);
            //请对应参考offset属性的描述内容
            ctx.drawImage(this.icon, screenX + this.offsetX, screenY + this.offsetY, this.width, this.height);
            ctx.restore();
        }
    }
    //判断点是否在符号范围内
    contain(anchorX, anchorY, screenX, screenY) {
        return screenX >= (anchorX + this.offsetX) &&  screenX <= (anchorX + this.offsetX + this.width) && screenY >= (anchorY + this.offsetY) &&  screenY <= (anchorY + this.offsetY + this.height);
    }
}
 /**
 * 文本符号
 * @remarks
 * 常用于文本标注
 */
export class SimpleTextSymbol extends Symbol {
    public lineWidth: number = 3;
    public strokeStyle: string = "#ff0000"; //#ffffff
    public fillStyle: string = "#ffffff";    //#ffffff
    public offsetX: number = 0;
    public offsetY: number = 1;
    public padding: number = 5;
    public fontColor: string = "#ff0000";
    public fontSize: number = 12;
    public fontFamily: string = "YaHei";
    public fontWeight: string = "Bold";
}
 /**
 * 聚合符号
 * @remarks
 * 限制用于点图层
 */
export class ClusterSymbol extends PointSymbol {
    //聚合数量
    private _count: number = 2;
    //聚合符号的默认半径
    public radius: number = 10;
    //重写描边样式
    public strokeStyle: string = "#ffffff"; //#ff0000
    //聚合外圈填充样式
    public outerFillStyle: string = "#ffffff";    //#ff0000
    //聚合数量字体设置
    public fontColor: string = "#ffffff";
    public fontFamily: string = "YaHei";
    public fontWeight: string = "Bold";

    //大于99，标记为99+
    get text(): string {
        return this._count <= 99 ? this._count.toString() : "99+";
    }
    //内圈半径
    get inner(): number {
        return this._count <= 15 ? this.radius + this._count : this.radius + 15;
    }
    //外圈半径
    get outer(): number {
        return this.inner + 4;
    }
    //字体随数量递增，同时控制为非无限递增
    get fontSize(): number {
        if (this._count < 10 ) {
            return 12;
        } else if (this._count >= 10 && this._count < 30) {
            return 14;
        } else if (this._count >= 30 && this._count < 50) {
            return 16;
        } else if (this._count >= 30 && this._count < 50) {
            return 18;
        } else if (this._count > 50) {
            return 20;
        }
    }
    //聚合的内圈填充样式
    //采用色带，色带可自定义扩展
    get innerFillStyle(): string {
        //const colors = Color.ramp(new Color(0, 255, 0), new Color(255,0,0), 16);
        //const colors = Color.ramp(new Color(22,198,227), new Color(255, 0, 255), 16);
        const colors = Color.ramp(new Color(25,202,173), new Color(244, 96, 108), 16);
        return colors[this._count <= 15 ? this._count : 15].toString();
    }

    constructor(count: number) {
        super();
        this._count = count;
    }

    //绘制聚合符号
    draw(ctx: CanvasRenderingContext2D, screenX, screenY) {
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.outerFillStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath(); //Start path
        //keep size 画外圈
        ctx.arc(screenX, screenY, this.outer, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = this.innerFillStyle;
        ctx.beginPath(); //Start path
        //keep size 画内圈
        ctx.arc(screenX, screenY, this.inner, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = this.fontColor;
        ctx.font =  this.fontSize + "px/1 " + this.fontFamily +  " " + this.fontWeight;
        ctx.fillText(this.text, screenX, screenY);
        ctx.restore();
    }
}