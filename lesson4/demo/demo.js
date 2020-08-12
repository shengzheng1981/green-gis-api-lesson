import {
    Map,
    Point,
    Polyline,
    SimpleFillSymbol,
    FeatureClass,
    FeatureLayer,
    SimpleRenderer,
    CategoryRenderer,
    CategoryRendererItem,
    Field,
    FieldType,
    Graphic, SimpleMarkerSymbol, Feature, LatLngType, GCJ02
} from "../dist";

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

    var req = new XMLHttpRequest();
    req.onload = (event) => {
        const featureClass = new FeatureClass();
        featureClass.loadGeoJSON(JSON.parse(req.responseText));
        const featureLayer = new FeatureLayer();
        featureLayer.featureClass = featureClass;
        const field = new Field();
        field.name = "name";
        field.type = FieldType.String;
        //类别渲染，自动生成
        const renderer = new CategoryRenderer();
        renderer.generate(featureClass, field);
        //单一渲染，暂注释
            /*const renderer = new SimpleRenderer();
            renderer.symbol = new SimpleFillSymbol();*/
        featureLayer.renderer = renderer;
        featureLayer.zoom = [5, 20];
        map.addLayer(featureLayer);
    };
    req.open("GET", "assets/geojson/chongqing.json", true);
    req.send(null);

    map.setView([107.777, 29.809], 7);
}

//cause typescript tsc forget js suffix for geometry.js