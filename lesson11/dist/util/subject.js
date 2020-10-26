/**
 * 可订阅对象
 * @remarks
 * 事件监听者列表
 * {
 *    click: [clickhander1, clickhandler2, ...]
 *    mousemove: [mousemovehander1, mousemovehandler2, ...]
 * }
 */
export class Subject {
    /**
     * 事件名称数组
     * ["click", "mousemove"]
     * @param {string[]} events - 事件名称数组
     */
    constructor(events) {
        this._handlers = {};
        events.forEach(event => {
            this._handlers[event] = []; //handlers array
        });
    }
    /**
     * 事件注册监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    on(event, handler) {
        this._handlers[event].push(handler);
    }
    /**
     * 事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event, handler) {
        if (Array.isArray(this._handlers[event])) {
            const index = this._handlers[event].findIndex(item => item === handler);
            index != -1 && this._handlers[event].splice(index, 1);
        }
    }
    /**
     * 激发事件
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event, param) {
        this._handlers[event].forEach(handler => handler(param));
    }
}
