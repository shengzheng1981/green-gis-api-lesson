//可订阅对象
export class Subject {
    //事件监听者列表
    //{
    //  click: [clickhander1, clickhandler2, ...]
    //  mousemove: [mousemovehander1, mousemovehandler2, ...]
    //}
    protected _handlers: any = { };

    //["click", "mousemove"]
    constructor(events: string[]) {
        events.forEach( event => {
            this._handlers[event] = [];  //handlers array
        });
    }

    //事件注册监听
    on(event, handler) {
        this._handlers[event].push(handler);
    }

    //事件取消监听
    off(event, handler) {
        if (Array.isArray(this._handlers[event])) {
            const index = this._handlers[event].findIndex( item => item === handler );
            index != -1 && this._handlers[event].splice(index, 1);
        }
    }

    //激发事件
    emit(event, param) {
        this._handlers[event].forEach(handler => handler(param));
    }
}