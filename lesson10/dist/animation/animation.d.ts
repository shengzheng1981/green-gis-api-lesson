import { Point } from "../geometry/Point";
import { Projection } from "../projection/projection";
import { Polyline } from "../geometry/Polyline";
/**
 * 动画效果基类
 * @remarks
 * 动画两种实现方式：
 * 1.针对单个图形要素，实现动画，使用时，逻辑较清晰；
 * 2.针对整个图层，类似Symbol，使用时，可能存在效率问题；
 * 目前暂实现1，针对2，目前保留部分已注释的代码，便于日后参考。
 */
export declare class Animation {
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx: CanvasRenderingContext2D, projection?: Projection): void;
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed: any, ctx: CanvasRenderingContext2D): void;
}
/**
 * 点默认动画效果类
 * @remarks
 * 类似flashing效果，从中心点向外光环扩散效果
 */
export declare class PointAnimation extends Animation {
    protected _point: Point;
    protected _screenX: number;
    protected _screenY: number;
    /**
     * 边宽
     */
    lineWidth: number;
    /**
     * 颜色
     */
    color: string;
    /**
     * 扩散速度
     */
    velocity: number;
    /**
     * 扩散的最大半径
     */
    limit: number;
    /**
     * 扩散的光圈数
     */
    ring: number;
    /**
     * 创建动画效果
     * @param {Point} geometry - 点
     */
    constructor(geometry: Point);
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx: CanvasRenderingContext2D, projection?: Projection): void;
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed: any, ctx: CanvasRenderingContext2D): void;
}
/**
 * 线默认动画效果类
 * @remarks
 * 类似航线效果
 */
export declare class LineAnimation extends Animation {
    protected _polyline: Polyline;
    protected _screen: number[][];
    private _start;
    private _end;
    private _control;
    private _percent;
    /**
     * 线宽
     */
    lineWidth: number;
    /**
     * 起始色
     */
    startColor: string;
    /**
     * 终止色
     */
    endColor: string;
    /**
     * 二次贝塞尔曲线控制点与线段夹角
     */
    angle: number;
    /**
     * 创建动画效果
     * @param {Polyline} geometry - 线
     */
    constructor(geometry: Polyline);
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx: CanvasRenderingContext2D, projection?: Projection): void;
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed: any, ctx: CanvasRenderingContext2D): void;
    _drawCurvePath(ctx: any, start: any, point: any, end: any, percent: any): void;
    _quadraticBezier(p0: any, p1: any, p2: any, t: any): number;
}
