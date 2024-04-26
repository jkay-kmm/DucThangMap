import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';


//-- lớp Image --
import ImageLayer from 'ol/layer/Image';
//-- lớp ImageWMS --
import ImageWMS from 'ol/source/ImageWMS';
import XYZ from 'ol/source/XYZ';

//-- Dữ liệu bản đồ chuyên đề --
const layers = [
  //-- lớp nền OSM --
  new TileLayer({
    source: new OSM()
  }),
  //-- bản đồ nền phường Đức Thắng --
  new ImageLayer({
    //extent: [105.77096227779482, 21.07072342708786,
    //         105.78266848435597, 21.086510768213763],
    source: new ImageWMS({
      url: 'http://localhost:8080/geoserver/ducthangmap/wms',
      params: {
        'FORMAT': 'image/png',
        'VERSION': '1.1.1',
        'STYLES': '',
        'LAYERS': 'lbs_app_2024:DucThang_LBS_Basemap',
      },
      ratio: 1,
      serverType: 'geoserver',
      imageLoadFunction: function(image, src) {
           var params = new URLSearchParams(src.slice(src.indexOf('?')));
           console.log('bounds', params.get('BBOX'));
           image.getImage().src = src;
         }
    })
  }),
];

//-- Đối tượng bản đồ --
const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: [11774909.8, 2401172.3],
    zoom: 15,
  })
});
const overviewMapControl = new OverviewMap({
  layers: [
    new TileLayer({
      source: new XYZ(
        {
          url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 19
        }
      )
    })
  ]
})
// var mapView = new ol.View({
//  center:ol.proj.fromLonLat([105.78266848435597, 21.086510768213763]),
//  zoom: 8,
// })
// var map = new ol.Map({
//   target:"map",
//   layers:[
//     new ol.layer.Tile({
//       source: new ol.source.OSM()
//     })
//   ],
//   view:mapView
//  });
//  var OSM = new ol.layer.Tile({
//   title: 'OpenStreetMap',
//   visible: true,
//   source: new ol.source.OSM()
//  });
//  map.addLayer(OSM)