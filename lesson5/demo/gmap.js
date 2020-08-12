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
    const gmap = new google.maps.Map(document.getElementById('gmap'), {
        disableDefaultUI: true,
        gestureHandling: "none",
        scrollwheel: false
    });

    const map = new Map("foo");
    map.on("extent", (event) => {
        gmap.setZoom(event.zoom);
        gmap.setCenter({lat: event.center[1], lng: event.center[0]});
    });

    //map.setProjection(new GCJ02(LatLngType.GCJ02));
    map.setView([116.397411,39.909186], 12);
    
    const marker = new SimpleMarkerSymbol();
    marker.width = 32;
    marker.height = 32;
    marker.offsetX = 16;
    marker.offsetY = 32;
    marker.url = "assets/img/marker.svg";
    //await marker.load();
    const point = new Point(116.397411,39.909186);
    const graphic = new Graphic(point, marker);
    map.addGraphic(graphic);

   
}

//cause typescript tsc forget js suffix for geometry.js