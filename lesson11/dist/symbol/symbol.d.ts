/**
* 符号基类
* @remarks
* 如按现实世界来抽取对象基类，下述属性不应放在基类
* 但考虑到Canvas的上下文设定，才决定抽取到基类
*/
export declare class Symbol {
    /**
     * 线宽
     */
    lineWidth: number;
    /**
     * 描边样式
     */
    strokeStyle: string;
    /**
     * 填充样式
     */
    fillStyle: string;
}
/**
* 点符号基类
*/
export declare class PointSymbol extends Symbol {
    /**
     * 绘制点（虚函数）
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): void;
    /**
     * 判断鼠标交互位置是否在符号范围内（虚函数）
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX: any, anchorY: any, screenX: any, screenY: any): boolean;
}
/**
* 线符号基类
*/
export declare class LineSymbol extends Symbol {
    /**
     * 绘制线（虚函数）
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx: CanvasRenderingContext2D, screen: number[][]): void;
}
/**
* 面符号基类
* @remarks
* aka 填充符号
*/
export declare class FillSymbol extends Symbol {
    /**
    * 绘制面（虚函数）
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number[][][]} screen - 面对应坐标点的屏幕坐标集合
    */
    draw(ctx: CanvasRenderingContext2D, screen: number[][][]): void;
}
/**
* 简单圆点符号
* @remarks
* 最常用的点符号
*/
export declare class SimplePointSymbol extends PointSymbol {
    /**
    * 圆点半径，像素值
    */
    radius: number;
    /**
     * 绘制点
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): void;
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX: any, anchorY: any, screenX: any, screenY: any): boolean;
}
/**
* 简单线符号
* @remarks
* 最常用的线符号
*/
export declare class SimpleLineSymbol extends LineSymbol {
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx: CanvasRenderingContext2D, screen: number[][]): void;
}
/**
* 简单面符号
* @remarks
* 最常用的面填充符号
*/
export declare class SimpleFillSymbol extends Symbol {
    /**
    * 重写线宽默认值，基类为1，按需设置，可省略
    */
    lineWidth: number;
    /**
    * 绘制面
    * @remarks
    * 奇偶填充
    * https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fill
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number[][][]} screen - 面对应坐标点的屏幕坐标集合
    */
    draw(ctx: CanvasRenderingContext2D, screen: number[][][]): void;
}
/**
* 图标符号
* @remarks
* 常用于POI兴趣点的渲染
*/
export declare class SimpleMarkerSymbol extends PointSymbol {
    /**
    * 宽
    */
    width: number;
    /**
    * 高
    */
    height: number;
    /**
    * offset，坐标点对应图标的位置
    * 例如，宽16px，高16px，offsetX为-8，offsetY为-8，意味着：
    * 该图标的中心点对应渲染点的坐标。
    */
    offsetX: number;
    /**
    * offset，坐标点对应图标的位置
    * 例如，宽16px，高16px，offsetX为-8，offsetY为-8，意味着：
    * 该图标的中心点对应渲染点的坐标。
    */
    offsetY: number;
    /**
    * 图标位图
    */
    icon: ImageBitmap;
    /**
    * 图标url
    */
    url: string;
    private _loaded;
    /**
    * 记录是否已完成异步图标加载
    */
    get loaded(): boolean;
    /**
    * 异步加载图标
    * @return {Color} 生成随机色带
    */
    load(): Promise<any>;
    /**
    * 绘制图标
    * @remarks
    * 注意异步加载
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number} screenX - 屏幕坐标X
    * @param {number} screenY - 屏幕坐标Y
    */
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): Promise<void>;
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX: any, anchorY: any, screenX: any, screenY: any): boolean;
}
/**
* 文本符号
* @remarks
* 常用于文本标注
*/
export declare class SimpleTextSymbol extends Symbol {
    /**
    * 边框宽
    */
    lineWidth: number;
    /**
    * 边框色
    */
    strokeStyle: string;
    /**
    * 填充色
    */
    fillStyle: string;
    /**
    * X偏移
    */
    offsetX: number;
    /**
    * Y偏移
    */
    offsetY: number;
    /**
    * 周边留白
    */
    padding: number;
    /**
    * 字体颜色
    */
    fontColor: string;
    /**
    * 字体大小
    */
    fontSize: number;
    /**
    * 字体
    */
    fontFamily: string;
    /**
    * 字体粗细
    */
    fontWeight: string;
}
/**
* 聚合符号
* @remarks
* 限制用于点图层
*/
export declare class ClusterSymbol extends PointSymbol {
    /**
    * 聚合数量
    */
    private _count;
    /**
    * 聚合符号的默认半径
    */
    radius: number;
    /**
    * 重写描边样式
    */
    strokeStyle: string;
    /**
    * 聚合外圈填充样式
    */
    outerFillStyle: string;
    /**
    * 聚合数量字体颜色
    */
    fontColor: string;
    /**
    * 聚合数量字体
    */
    fontFamily: string;
    /**
    * 聚合数量字体粗细
    */
    fontWeight: string;
    /**
    * 聚合数量文本
    * @remarks
    * 大于99，标记为99+
    */
    get text(): string;
    /**
    * 内圈半径
    */
    get inner(): number;
    /**
    * 外圈半径
    */
    get outer(): number;
    /**
    * 字体随数量递增，同时控制为非无限递增
    */
    get fontSize(): number;
    /**
   * 聚合的内圈填充样式
   * @remarks
   * 采用色带，色带可自定义扩展
   */
    get innerFillStyle(): string;
    /**
    * 创建聚合符号
    * @param {number} count - 聚合数量
    */
    constructor(count: number);
    /**
    * 绘制聚合符号
    * @param {CanvasRenderingContext2D} ctx - 绘图上下文
    * @param {number} screenX - 屏幕坐标X
    * @param {number} screenY - 屏幕坐标Y
    */
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): void;
}
/**
* 字符符号
* @remarks
* 中英文皆可，注意控制长度，推荐单个字符
*/
export declare class LetterSymbol extends PointSymbol {
    /**
    * 外圈半径
    */
    radius: number;
    /**
    * 字符，中英文皆可，推荐单个字符
    */
    letter: string;
    /**
    * 字体颜色
    */
    fontColor: string;
    /**
    * 字体大小
    */
    fontSize: number;
    /**
    * 字体
    */
    fontFamily: string;
    /**
    * 字体粗细
    */
    fontWeight: string;
    /**
     * 绘制字符符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number} screenX - 屏幕坐标X
     * @param {number} screenY - 屏幕坐标Y
     */
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): void;
    /**
     * 判断鼠标交互位置是否在符号范围内
     * @param {number} anchorX - 鼠标交互位置X
     * @param {number} anchorY - 鼠标交互位置Y
     * @param {number} screenX - 点所在屏幕坐标X
     * @param {number} screenY - 点所在屏幕坐标Y
     */
    contain(anchorX: any, anchorY: any, screenX: any, screenY: any): boolean;
}
/**
* 箭头符号
*/
export declare class ArrowSymbol extends Symbol {
    /**
    * 线宽
    */
    lineWidth: number;
    /**
     * 决定绘制箭头的最小线长
     * @remarks 屏幕坐标，单位pixel
     * 默认 >50pixels will draw arrow
     */
    minLength: number;
    /**
     * 箭翼长度
     */
    arrowLength: number;
    /**
     * 箭翼夹角
     * @remarks 默认 angle 30 = Math.PI / 6
     */
    arrowAngle: number;
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {number[][]} screen - 线对应坐标点的屏幕坐标集合
     */
    draw(ctx: CanvasRenderingContext2D, screen: number[][]): void;
}
