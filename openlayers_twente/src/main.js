//在浏览器页面中引入地图
import './style.css';
import 'ol/ol.css';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ';



const view = new View({
  center: [694118.1989320087, 6829154.600371235],
  zoom: 16,
  // projection: "EPSG:4326",
  //Delden:743345.6427273116,6844779.718830286
  //Hengelo:757391.5712651528,6844752.293851171
});

const osmLayer = new TileLayer({
  source: new OSM(),
})

const esriLayer = new TileLayer({
  source: new XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  })
});

const map = new Map({
  target: 'map',
  view,
  layers: [osmLayer, esriLayer]
})

//更换地点
const btnEefde = document.querySelector('.btnsEefde button');
if (btnEefde) {
  btnEefde.onclick = function () {
    view.setCenter([694118.1989320087, 6829154.600371235]);
  };
}

const btnDelden = document.querySelector('.btnsDelden button');
if (btnDelden) {
  btnDelden.onclick = function () {
    view.setCenter([743345.6427273116, 6844779.718830286]);
  };
}

const btnHengelo = document.querySelector('.btnsHengelo button');
if (btnHengelo) {
  btnHengelo.onclick = function () {
    view.setCenter([757391.5712651528,6844752.293851171]);
  };
}

//更换地图
const streetMapBtn = document.querySelector('.btnsStreetmap button');
const satelliteMapBtn = document.querySelector('.btnsSatellitemap button');


satelliteMapBtn.addEventListener('click', () => {
  osmLayer.setVisible(false);
  esriLayer.setVisible(true);
});

streetMapBtn.addEventListener('click', () => {
  osmLayer.setVisible(true);
  esriLayer.setVisible(false);
});

