import { Map } from "./map";
import { Subject } from "./util/subject";
/**
 * 动画效果的管理器
 * 已内置于map，可通过map的接口进行添加删除的维护操作
 */
export declare class Animator extends Subject {
    private _canvas;
    private _ctx;
    private _map;
    private _animations;
    /**
     * 创建Animator
     * 不应自主创建，map内部创建
     * @param {Map} map - 地图容器
     */
    constructor(map: Map);
    _onResize(event: any): void;
    _extentChange(event: any): void;
    /**
     * 添加动画
     * @param {Animation} animation - 动画
     */
    addAnimation(animation: any): void;
    /**
     * 删除动画
     * @param {Animation} animation - 动画
     */
    removeAnimation(animation: any): void;
    /**
     * 清除动画
     */
    clearAnimations(): void;
    private _frame;
    private _start;
    /**
     * 重绘
     */
    redraw(): void;
    /**
     * 动画循环
     * @param {number} timestamp - 时间戳
     */
    animate(timestamp: any): void;
    /**
     * 清空画布
     */
    clear(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
