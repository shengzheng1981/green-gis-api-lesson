import {Map, Point, Polyline, Polygon, Graphic, GraphicLayer, SimpleLineSymbol, SimplePointSymbol, SimpleMarkerSymbol} from "../dist";

window.load = () => {
    const amap = new AMap.Map("amap", {
        fadeOnZoom: false,
        navigationMode: 'classic',
        optimizePanAnimation: false,
        animateEnable: false,
        dragEnable: false,
        zoomEnable: false,
        resizeEnable: true,
        doubleClickZoom: false,
        keyboardEnable: false,
        scrollWheel: false,
        expandZoomRange: true,
        zooms: [1, 20],
        mapStyle: 'normal',
        features: ['road', 'point', 'bg'],
        viewMode: '2D'
    });

    const map = new Map("foo");
    map.on("extent", (event) => {
        amap.setZoomAndCenter(event.zoom, event.center);
    });

    /* //画经线
    for (let i = -180; i <= 180; i = i + 10){
        const line = new Polyline([[i, -80], [i, 80]]);
        line.addTo(map);
    }
    //画纬线
    for (let j = -80; j <= 80; j = j + 10){
        const line = new Polyline([[-180, j], [180, j]]);
        line.addTo(map);
    }
    //画经纬线交点
    for (let i = -180; i <= 180; i = i + 10){
        for (let j = -90; j <= 90; j = j + 10){
            const point = new Point(i, j);
            point.addTo(map);
        }
    }*/


    //画经线
    const lngLayer = new GraphicLayer();
    const lngSymbol = new SimpleLineSymbol();
    lngSymbol.strokeStyle = "#0000ff";
    for (let i = -180; i <= 180; i = i + 10){
        const line = new Polyline([[i, -80], [i, 80]]);
        const graphic = new Graphic(line, lngSymbol);
        lngLayer.add(graphic);
    }
    map.addLayer(lngLayer);
    //画纬线
    const latLayer = new GraphicLayer();
    const latSymbol = new SimpleLineSymbol();
    latSymbol.strokeStyle = "#4d9221";
    for (let j = -80; j <= 80; j = j + 10){
        const line = new Polyline([[-180, j], [180, j]]);
        const graphic = new Graphic(line, latSymbol);
        latLayer.add(graphic);
    }
    map.addLayer(latLayer);
    //画经纬线交点
    const pointLayer = new GraphicLayer();
    const pointSymbol = new SimplePointSymbol();
    pointSymbol.radius = 5;
    pointSymbol.fillStyle = "#de77ae";
    pointSymbol.strokeStyle = "#c51b7d";
    for (let i = -180; i <= 180; i = i + 10){
        for (let j = -90; j <= 90; j = j + 10){
            const point = new Point(i, j);
            const graphic = new Graphic(point, pointSymbol);
            pointLayer.add(graphic);
        }
    }
    map.addLayer(pointLayer);

    /* const point = new Point(116.397411,39.909186);
    point.addTo(map); */

    //beijing gugong
    const marker = new SimpleMarkerSymbol();
    marker.width = 32;
    marker.height = 32;
    marker.offsetX = 16;
    marker.offsetY = 32;
    marker.url = "assets/img/marker.svg";
    const point = new Point(116.397411,39.909186);
    const graphic = new Graphic(point, marker);
    map.addGraphic(graphic);

    map.setView([0, 0], 5);
}

//cause typescript tsc forget js suffix for geometry.js