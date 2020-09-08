/**
 * 可订阅对象
 * @remarks
 * 事件监听者列表
 * {
 *    click: [clickhander1, clickhandler2, ...]
 *    mousemove: [mousemovehander1, mousemovehandler2, ...]
 * }
 */
export declare class Subject {
    protected _handlers: any;
    /**
     * 事件名称数组
     * ["click", "mousemove"]
     * @param {string[]} events - 事件名称数组
     */
    constructor(events: string[]);
    /**
     * 事件注册监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    on(event: any, handler: any): void;
    /**
     * 事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event: any, handler: any): void;
    /**
     * 激发事件
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event: any, param: any): void;
}
