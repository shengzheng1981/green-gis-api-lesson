var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Color } from "../util/color";
/**
* 符号基类
* @remarks
* 如按现实世界来抽取对象基类，下述属性不应放在基类
* 但考虑到Canvas的上下文设定，才决定抽取到基类
*/
export class Symbol {
    constructor() {
        /**
         * 线宽
         */
        this.lineWidth = 1;
        /**
         * 描边样式
         */
        this.strokeStyle = "#ff0000";
        /**
         * 填充样式
         */
        this.fillStyle = "#ff000088";
    }
}
/**
* 点符号基类
*/
export class PointSymbol extends Symbol {
    /**
     * 绘制点（虚函数）
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx, screenX, screenY) { }
    /**
     * 判断鼠标交互位置是否在符号范围内（虚函数）
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) { return false; }
}
/**
* 线符号基类
*/
export class LineSymbol extends Symbol {
    /**
     * 绘制线（虚函数）
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx, screen) { }
}
/**
* 面符号基类
* @remarks
* aka 填充符号
*/
export class FillSymbol extends Symbol {
    /**
    * 绘制面（虚函数）
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number[][][]} screen - 面对应坐标点的屏幕坐标集合
    */
    draw(ctx, screen) { }
}
/**
* 简单圆点符号
* @remarks
* 最常用的点符号
*/
export class SimplePointSymbol extends PointSymbol {
    constructor() {
        super(...arguments);
        /**
        * 圆点半径，像素值
        */
        this.radius = 6;
    }
    /**
     * 绘制点
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx, screenX, screenY) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath(); //Start path
        //keep size
        //地理坐标 转回 屏幕坐标
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) {
        return Math.sqrt((anchorX - screenX) * (anchorX - screenX) + (anchorY - screenY) * (anchorY - screenY)) <= this.radius;
    }
}
/**
* 简单线符号
* @remarks
* 最常用的线符号
*/
export class SimpleLineSymbol extends LineSymbol {
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx, screen) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        screen.forEach((point, index) => {
            const screenX = point[0], screenY = point[1];
            if (index === 0) {
                ctx.moveTo(screenX, screenY);
            }
            else {
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
* 最常用的面填充符号
*/
export class SimpleFillSymbol extends Symbol {
    constructor() {
        super(...arguments);
        /**
        * 重写线宽默认值，基类为1，按需设置，可省略
        */
        this.lineWidth = 2;
    }
    /**
    * 绘制面
    * @remarks
    * 奇偶填充
    * https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fill
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number[][][]} screen - 面对应坐标点的屏幕坐标集合
    */
    draw(ctx, screen) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //TODO:  exceeding the maximum extent(bound), best way is overlap by extent. find out: maximum is [-PI*R, PI*R]??
        ctx.beginPath();
        screen.forEach(ring => {
            ring.forEach((point, index) => {
                const screenX = point[0], screenY = point[1];
                if (index === 0) {
                    ctx.moveTo(screenX, screenY);
                }
                else {
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
    constructor() {
        super(...arguments);
        /**
        * 宽
        */
        this.width = 16;
        /**
        * 高
        */
        this.height = 16;
        /**
        * offset，坐标点对应图标的位置
        * 例如，宽16px，高16px，offsetX为-8，offsetY为-8，意味着：
        * 该图标的中心点对应渲染点的坐标。
        */
        this.offsetX = -8;
        /**
        * offset，坐标点对应图标的位置
        * 例如，宽16px，高16px，offsetX为-8，offsetY为-8，意味着：
        * 该图标的中心点对应渲染点的坐标。
        */
        this.offsetY = -8;
    }
    /**
    * 记录是否已完成异步图标加载
    */
    get loaded() {
        return this._loaded;
    }
    /**
    * 异步加载图标
    * @return {Color} 生成随机色带
    */
    load() {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                createImageBitmap(img).then(icon => {
                    this.icon = icon;
                    this._loaded = true;
                    resolve(icon);
                }, err => reject(err));
            };
            img.onerror = reject;
            img.src = this.url;
        });
    }
    /**
    * 绘制图标
    * @remarks
    * 注意异步加载
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number} screenX - 屏幕坐标X
    * @param {number} screenY - 屏幕坐标Y
    */
    draw(ctx, screenX, screenY) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded)
                yield this.load();
            if (this.icon) {
                ctx.save();
                const matrix = ctx.getTransform();
                //keep size
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                //请对应参考offset属性的描述内容
                ctx.drawImage(this.icon, screenX + this.offsetX, screenY + this.offsetY, this.width, this.height);
                ctx.restore();
            }
        });
    }
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) {
        return screenX >= (anchorX + this.offsetX) && screenX <= (anchorX + this.offsetX + this.width) && screenY >= (anchorY + this.offsetY) && screenY <= (anchorY + this.offsetY + this.height);
    }
}
/**
* 文本符号
* @remarks
* 常用于文本标注
*/
export class SimpleTextSymbol extends Symbol {
    constructor() {
        super(...arguments);
        /**
        * 边框宽
        */
        this.lineWidth = 3;
        /**
        * 边框色
        */
        this.strokeStyle = "#ff0000"; //#ffffff
        /**
        * 填充色
        */
        this.fillStyle = "#ffffff"; //#ffffff
        /**
        * X偏移
        */
        this.offsetX = 0;
        /**
        * Y偏移
        */
        this.offsetY = 1;
        /**
        * 周边留白
        */
        this.padding = 5;
        /**
        * 字体颜色
        */
        this.fontColor = "#ff0000";
        /**
        * 字体大小
        */
        this.fontSize = 12;
        /**
        * 字体
        */
        this.fontFamily = "YaHei";
        /**
        * 字体粗细
        */
        this.fontWeight = "Bold";
    }
}
/**
* 聚合符号
* @remarks
* 限制用于点图层
*/
export class ClusterSymbol extends PointSymbol {
    /**
    * 创建聚合符号
    * @param {number} count - 聚合数量
    */
    constructor(count) {
        super();
        /**
        * 聚合数量
        */
        this._count = 2;
        /**
        * 聚合符号的默认半径
        */
        this.radius = 10;
        /**
        * 重写描边样式
        */
        this.strokeStyle = "#ffffff"; //#ff0000
        /**
        * 聚合外圈填充样式
        */
        this.outerFillStyle = "#ffffff"; //#ff0000
        /**
        * 聚合数量字体颜色
        */
        this.fontColor = "#ffffff";
        /**
        * 聚合数量字体
        */
        this.fontFamily = "YaHei";
        /**
        * 聚合数量字体粗细
        */
        this.fontWeight = "Bold";
        this._count = count;
    }
    /**
    * 聚合数量文本
    * @remarks
    * 大于99，标记为99+
    */
    get text() {
        return this._count <= 99 ? this._count.toString() : "99+";
    }
    /**
    * 内圈半径
    */
    get inner() {
        return this._count <= 15 ? this.radius + this._count : this.radius + 15;
    }
    /**
    * 外圈半径
    */
    get outer() {
        return this.inner + 4;
    }
    /**
    * 字体随数量递增，同时控制为非无限递增
    */
    get fontSize() {
        if (this._count < 10) {
            return 12;
        }
        else if (this._count >= 10 && this._count < 30) {
            return 14;
        }
        else if (this._count >= 30 && this._count < 50) {
            return 16;
        }
        else if (this._count >= 30 && this._count < 50) {
            return 18;
        }
        else if (this._count > 50) {
            return 20;
        }
    }
    /**
   * 聚合的内圈填充样式
   * @remarks
   * 采用色带，色带可自定义扩展
   */
    get innerFillStyle() {
        //const colors = Color.ramp(new Color(0, 255, 0), new Color(255,0,0), 16);
        //const colors = Color.ramp(new Color(22,198,227), new Color(255, 0, 255), 16);
        const colors = Color.ramp(new Color(25, 202, 173), new Color(244, 96, 108), 16);
        return colors[this._count <= 15 ? this._count : 15].toString();
    }
    /**
    * 绘制聚合符号
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number} screenX - 屏幕坐标X
    * @param {number} screenY - 屏幕坐标Y
    */
    draw(ctx, screenX, screenY) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        ctx.font = this.fontSize + "px/1 " + this.fontFamily + " " + this.fontWeight;
        ctx.fillText(this.text, screenX, screenY);
        ctx.restore();
    }
}
/**
* 字符符号
* @remarks
* 中英文皆可，注意控制长度，推荐单个字符
*/
export class LetterSymbol extends PointSymbol {
    constructor() {
        super(...arguments);
        /**
        * 外圈半径
        */
        this.radius = 10;
        /**
        * 字符，中英文皆可，推荐单个字符
        */
        this.letter = "";
        /**
        * 字体颜色
        */
        this.fontColor = "#ff0000";
        /**
        * 字体大小
        */
        this.fontSize = 12;
        /**
        * 字体
        */
        this.fontFamily = "YaHei";
        /**
        * 字体粗细
        */
        this.fontWeight = "Bold";
    }
    /**
     * 绘制字符符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx, screenX, screenY) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath(); //Start path
        //keep size
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //绘制外圈
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = this.fontColor;
        ctx.font = this.fontSize + "px/1 " + this.fontFamily + " " + this.fontWeight;
        //绘制字符
        ctx.fillText(this.letter, screenX, screenY);
        ctx.restore();
    }
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX, anchorY, screenX, screenY) {
        return Math.sqrt((anchorX - screenX) * (anchorX - screenX) + (anchorY - screenY) * (anchorY - screenY)) <= this.radius;
    }
}
/**
* 箭头符号
*/
export class ArrowSymbol extends Symbol {
    constructor() {
        super(...arguments);
        /**
        * 线宽
        */
        this.lineWidth = 2;
        /**
         * 决定绘制箭头的最小线长
         * @remarks 屏幕坐标，单位pixel
         * 默认 >50pixels will draw arrow
         */
        this.minLength = 50;
        /**
         * 箭翼长度
         */
        this.arrowLength = 10;
        /**
         * 箭翼夹角
         * @remarks 默认 angle 30 = Math.PI / 6
         */
        this.arrowAngle = Math.PI / 6;
    }
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx, screen) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        //keep lineWidth
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        screen.forEach((point, index) => {
            const screenX = point[0], screenY = point[1];
            if (index === 0) {
                ctx.moveTo(screenX, screenY);
            }
            else {
                ctx.lineTo(screenX, screenY);
            }
        });
        ctx.stroke();
        //已知 起点和终点  求沿线距起点定长的点
        const _getPointAlongLine = (p1, p2, d) => {
            //line length
            let l = Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
            let t = d / l;
            return [(1 - t) * p1[0] + t * p2[0], (1 - t) * p1[1] + t * p2[1]];
        };
        //已知 起点 y = kx + b   求沿线距起点定长的点 两个点
        const _getPointAlongLine2 = (k, b, p, d) => {
            let x0 = p[0] + Math.sqrt((d * d) / (k * k + 1)), x1 = p[0] - Math.sqrt((d * d) / (k * k + 1));
            return [[x0, k * x0 + b], [x1, k * x1 + b]];
        };
        screen.reduce((prev, cur) => {
            if (prev) {
                const length = Math.sqrt((cur[0] - prev[0]) * (cur[0] - prev[0]) + (cur[1] - prev[1]) * (cur[1] - prev[1]));
                if (length >= this.minLength) {
                    //中点 即箭头
                    const [middleX, middleY] = [(prev[0] + cur[0]) / 2, (prev[1] + cur[1]) / 2];
                    //箭尾垂线的垂足
                    const [footX, footY] = _getPointAlongLine([middleX, middleY], prev, Math.cos(this.arrowAngle) * this.arrowLength);
                    const k = (cur[1] - prev[1]) / (cur[0] - prev[0]);
                    // 1/k 垂线
                    const points = _getPointAlongLine2(-1 / k, footY - footX * -1 / k, [footX, footY], Math.sin(this.arrowAngle) * this.arrowLength);
                    //两点
                    points.forEach(point => {
                        ctx.beginPath();
                        ctx.moveTo(middleX, middleY);
                        ctx.lineTo(point[0], point[1]);
                        ctx.stroke();
                    });
                }
                return cur;
            }
            else {
                return cur;
            }
        });
        ctx.restore();
    }
}
