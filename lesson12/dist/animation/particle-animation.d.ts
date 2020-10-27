import { PointAnimation } from "./animation";
import { Projection } from "../projection/projection";
/**
 * 星球环绕动画效果类
 * @remarks
 * 轨道星球环绕动画效果
 */
export declare class ParticleAnimation extends PointAnimation {
    private _orbit;
    /**
     * 轨道半径
     */
    radius: number;
    /**
     * 环绕速度
     */
    speed: number;
    /**
     * 颜色
     */
    color: string;
    /**
     * 星球或粒子数
     */
    count: number;
    /**
     * alpha通道
     */
    alpha: number;
    /**
     * 颜色合成方式
     */
    composite: string;
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
