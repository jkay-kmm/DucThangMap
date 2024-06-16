import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image.js';
import OSM from 'ol/source/OSM.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { OverviewMap, defaults as defaultControls } from 'ol/control.js';
import { DragRotateAndZoom, defaults as defaultInteractions } from 'ol/interaction.js';
import { useGeographic } from 'ol/proj.js';

// Call useGeographic once to work with [longitude, latitude] coordinates
useGeographic();

// Verify the URL for WMS layer
const layers = [
  new TileLayer({
    source: new OSM()
  }),
  new ImageLayer({
    source: new ImageWMS({
      url: 'http://localhost:8080/geoserver/ducthangmap/wms',
      params: {
        'TILED': true,
        'FORMAT': 'image/png',
        'VERSION': '1.1.1',
        'STYLES': '',
        'LAYERS': 'ducthangmap:ducthangmap',
      },
      ratio: 1,
      serverType: 'geoserver',
    })
  }),
];

const source = new VectorSource();
const vector = new VectorLayer({
  source: source,
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#ffcc33',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#ffcc33',
  },
});

const overviewMapControl = new OverviewMap({
  // Custom CSS used in overviewmap-custom.html
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [
    new TileLayer({
      source: new OSM({
        'url': 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=56a90e5852d24988858fe169e5fca684',
      }),
    }),
  ],
  collapseLabel: '\u00BB',
  label: '\u00AB',
  collapsed: false,
});

const rotateWithView = document.getElementById('rotateWithView');
rotateWithView.addEventListener('change', function () {
  overviewMapControl.setRotateWithView(this.checked);
});

const map = new Map({
  controls: defaultControls().extend([overviewMapControl]),
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
  target: 'map',
  layers: [...layers, vector],
  view: new View({
    center: [105.7762, 21.078], // Coordinates in EPSG:4326
    zoom: 15,
  })
});

const modify = new Modify({ source: source });
map.addInteraction(modify);

let draw, snap;
const typeSelect = document.getElementById('type');

function addInteractions() {
  draw = new Draw({
    source: source,
    type: typeSelect.value,
  });
  map.addInteraction(draw);
  snap = new Snap({ source: source });
  map.addInteraction(snap);
}

typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
};

addInteractions();
