export declare class Subject {
    protected _handlers: any;
    constructor(events: string[]);
    on(event: any, handler: any): void;
    off(event: any, handler: any): void;
    emit(event: any, param: any): void;
}
