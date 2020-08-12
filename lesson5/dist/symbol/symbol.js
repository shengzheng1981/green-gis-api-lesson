export class Symbol {
}
export class SimplePointSymbol extends Symbol {
    constructor() {
        super(...arguments);
        //circle
        this.radius = 6;
        this.lineWidth = 1;
        this.strokeStyle = "#ff0000"; //#ff0000
        this.fillStyle = "#ff000088"; //#ff0000
    }
}
export class SimpleLineSymbol extends Symbol {
    constructor() {
        super(...arguments);
        this.lineWidth = 1;
        this.strokeStyle = "#ff0000"; //#ff0000
    }
}
export class SimpleFillSymbol extends Symbol {
    constructor() {
        super(...arguments);
        this.lineWidth = 2;
        this.strokeStyle = "#ff0000"; //#ff0000
        this.fillStyle = "#ff000088"; //#ff0000
    }
}
export class SimpleMarkerSymbol extends Symbol {
    constructor() {
        super(...arguments);
        this.width = 16;
        this.height = 16;
        this.offsetX = 8;
        this.offsetY = 8;
    }
    get loaded() {
        return this._loaded;
    }
    load() {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                createImageBitmap(img).then(icon => {
                    this.icon = icon;
                    this._loaded = true;
                    resolve(icon);
                }, err => reject(err));
            };
            img.onerror = reject;
            img.src = this.url;
        });
    }
}
