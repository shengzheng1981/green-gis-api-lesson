
export class Symbol {

}

export class SimplePointSymbol extends Symbol {
    //circle
    public radius: number = 6;
    public lineWidth: number = 1;
    public strokeStyle: string = "#ff0000"; //#ff0000
    public fillStyle: string = "#ff000088";    //#ff0000
}

export class SimpleLineSymbol extends Symbol {
    public lineWidth: number = 1;
    public strokeStyle: string = "#ff0000"; //#ff0000
}

export class SimpleFillSymbol extends Symbol {
    public lineWidth: number = 2;
    public strokeStyle: string = "#ff0000"; //#ff0000
    public fillStyle: string = "#ff000088";    //#ff0000
}

export class SimpleMarkerSymbol extends Symbol {
    public width: number = 16;
    public height: number = 16;
    public offsetX: number = 8;
    public offsetY: number = 8;
    public icon: ImageBitmap;
    public url: string;
    private _loaded: boolean;
    get loaded(): boolean {
        return this._loaded;
    }

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                createImageBitmap(img).then(icon => {
                    this.icon = icon;
                    this._loaded = true;
                    resolve(icon);
                },err => reject(err));
            };
            img.onerror = reject;
            img.src = this.url;
        })
    }
}
