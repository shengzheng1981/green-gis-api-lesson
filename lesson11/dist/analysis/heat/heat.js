import { Raster } from "../../element/raster";
import { GeometryType } from "../../geometry/geometry";
import { WebMercator } from "../../projection/web-mercator";
/*
 * 热力图
 * https://juejin.im/post/6844903709244129293
 */
export class Heat extends Raster {
    /**
     * 创建热力图
     */
    constructor() {
        super(0, 0, 0, 0);
        /**
         * 热力半径
         */
        this.radius = 40; //px
        /**
         * 渐变色
         */
        this.gradient = [
            { step: 0.3, color: "blue" },
            { step: 0.5, color: "lime" },
            { step: 0.7, color: "yellow" },
            { step: 1, color: "red" }
        ];
        /*
        * 蜂窝显示
        */
        this.honey = false;
        /*
        * 蜂窝边长
        */
        this.honeySide = 10;
    }
    /*
    * 动态栅格（实时渲染）
    */
    get dynamic() {
        return true;
    }
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = value;
    }
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = value;
    }
    /*
     * 初始化
     * @param {FeatureClass} featureClass - 点要素类
     * @param {Field} field - 值字段
     */
    generate(featureClass, field) {
        if (featureClass.type != GeometryType.Point)
            return;
        this._featureClass = featureClass;
        this._field = field;
        const values = featureClass.features.map(feature => feature.properties[field.name]);
        this._min = this._min || Math.min(...values), this._max = this._max || Math.max(...values);
        //初始化色带，256个颜色，1个像素代表1个颜色
        this._ramp = document.createElement("canvas");
        const ramp = this._ramp.getContext('2d');
        this._ramp.width = 256;
        this._ramp.height = 1;
        const grd = ramp.createLinearGradient(0, 0, this._ramp.width, this._ramp.height);
        this.gradient.forEach(item => {
            grd.addColorStop(item.step, item.color);
        });
        ramp.fillStyle = grd;
        ramp.fillRect(0, 0, this._ramp.width, this._ramp.height);
    }
    /**
     * 绘制栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) {
        //绘制alpha通道图，类似灰度图
        const canvas = document.createElement("canvas");
        canvas.width = ctx.canvas.width;
        canvas.height = ctx.canvas.height;
        const gray = canvas.getContext("2d");
        //遍历要素集合，根据字段值画alpha通道图
        this._featureClass.features.forEach((feature) => {
            const value = feature.properties[this._field.name];
            if (value != undefined) {
                const alpha = (value - this._min) / (this._max - this._min);
                const point = feature.geometry;
                point.project(projection);
                const matrix = ctx.getTransform();
                const screenX = (matrix.a * point.x + matrix.e);
                const screenY = (matrix.d * point.y + matrix.f);
                gray.save();
                gray.lineWidth = 0;
                const radgrad = gray.createRadialGradient(screenX, screenY, 0, screenX, screenY, this.radius);
                radgrad.addColorStop(0, "rgba(0, 0, 0, 1)");
                radgrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                gray.fillStyle = radgrad;
                gray.globalAlpha = alpha;
                gray.beginPath(); //Start path
                gray.arc(screenX, screenY, this.radius, 0, Math.PI * 2, true);
                gray.fill();
                gray.restore();
            }
        });
        //根据alpha值找到色带中对应颜色
        const colorData = this._ramp.getContext("2d").getImageData(0, 0, 256, 1).data;
        const imgData = gray.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        if (this.honey) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.strokeStyle = "#ffffff88";
            ctx.lineWidth = 1;
            let flag = 0; //奇偶标志
            for (let y = 0; y <= canvas.height; y = Math.floor(y + this.honeySide * 1.732 / 2)) {
                for (let x = 0 + flag * (3 / 2 * this.honeySide); x <= canvas.width; x = x + 3 * this.honeySide) {
                    const index = (y * canvas.width + x) * 4;
                    const alpha = data[index + 3];
                    //const pixelData = gray.getImageData(x, y, 1, 1);
                    //const pixel = pixelData.data;
                    //const alpha = pixel[3];
                    if (alpha != 0) {
                        ctx.fillStyle = "rgba(" + colorData[4 * alpha] + "," + colorData[4 * alpha + 1] + "," + colorData[4 * alpha + 2] + "," + alpha / 255 + ")";
                        //ctx.fillStyle ="rgba(255,0,0,0.5)";
                        ctx.beginPath();
                        ctx.moveTo(x - this.honeySide, y);
                        ctx.lineTo(x - 1 / 2 * this.honeySide, Math.floor(y - this.honeySide * 1.732 / 2));
                        ctx.lineTo(x + 1 / 2 * this.honeySide, Math.floor(y - this.honeySide * 1.732 / 2));
                        ctx.lineTo(x + this.honeySide, y);
                        ctx.lineTo(x + 1 / 2 * this.honeySide, Math.floor(y + this.honeySide * 1.732 / 2));
                        ctx.lineTo(x - 1 / 2 * this.honeySide, Math.floor(y + this.honeySide * 1.732 / 2));
                        ctx.lineTo(x - this.honeySide, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                }
                flag = flag === 0 ? 1 : 0;
            }
            ctx.restore();
        }
        else {
            for (let i = 0; i < data.length; i++) {
                const value = data[i];
                //只有alpha是有值，R，G，B待设置
                if (value > 0) {
                    //alpha值，对应colorData数组下标
                    data[i - 3] = colorData[4 * value]; //R
                    data[i - 2] = colorData[4 * value + 1]; //G
                    data[i - 1] = colorData[4 * value + 2]; //B
                }
            }
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(imgData, 0, 0);
            ctx.restore();
        }
    }
}
