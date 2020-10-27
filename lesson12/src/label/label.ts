import {Field} from "../data/field";
import {SimpleTextSymbol} from "../symbol/symbol";
import {Collision, SimpleCollision} from "./collision";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Feature} from "../element/feature";

/**
 * 图层标注设置
 */
export class Label {
    /**
     * 标注字段
     */
    field: Field;
    /**
     * 标注符号
     * @remarks 
     * 参考Renderer和Feature中的相关重要说明
     */
    symbol: SimpleTextSymbol = new SimpleTextSymbol();
    /**
     * 标注冲突解决方式
     */
    collision: Collision = new SimpleCollision();

    /**
     * 绘制图层标注
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    draw(features: Feature[], ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()) {
        //通过冲突检测，得到要绘制的要素集合
        const remain: Feature[] = this.collision.test(features, this.field, this.symbol, ctx, projection);
        //遍历绘制要素标注
        remain.forEach((feature: Feature) => {
            feature.label(this.field, ctx, projection, this.symbol);
        });
    }
}