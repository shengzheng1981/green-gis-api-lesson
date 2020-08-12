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

    const req = new XMLHttpRequest();
    req.onload = (event) => {
        const featureClass = new FeatureClass();
        featureClass.loadGeoJSON(JSON.parse(req.responseText));
        const featureLayer = new FeatureLayer();
        featureLayer.featureClass = featureClass;
        const renderer = new SimpleRenderer();
        featureLayer.cluster = true;
        featureLayer.renderer = renderer;
        featureLayer.zoom = [13, 20];
        map.addLayer(featureLayer);

        map.setView([109.519, 18.271], 13);
    };
    req.open("GET", "assets/geojson/junction.json", true);
    req.send(null);

}

//cause typescript tsc forget js suffix for geometry.js