import { SimpleTextSymbol } from "../symbol/symbol";
import { SimpleCollision } from "./collision";
import { WebMercator } from "../projection/web-mercator";
/**
 * 图层标注设置
 */
export class Label {
    constructor() {
        /**
         * 标注符号
         * @remarks
         * 参考Renderer和Feature中的相关重要说明
         */
        this.symbol = new SimpleTextSymbol();
        /**
         * 标注冲突解决方式
         */
        this.collision = new SimpleCollision();
    }
    /**
     * 绘制图层标注
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    draw(features, ctx, projection = new WebMercator()) {
        //通过冲突检测，得到要绘制的要素集合
        const remain = this.collision.test(features, this.field, this.symbol, ctx, projection);
        //遍历绘制要素标注
        remain.forEach((feature) => {
            feature.label(this.field, ctx, projection, this.symbol);
        });
    }
}
