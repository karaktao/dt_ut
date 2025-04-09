//在浏览器页面中引入地图
import './style.css';
import 'ol/ol.css';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';



// const map = new Map({
//   view: new View({
//     center: [694118.1989320087, 6829154.600371235],
//     zoom: 16,
//     // projection: "EPSG:4326",
//     //Delden:743345.6427273116,6844779.718830286
//     //Hengelo:757391.5712651528,6844752.293851171
//   }),
//   layers: [
//     new TileLayer({
//       source: new OSM(),
//     }),
//   ],
//   target: 'map',
// });



const view = new View({
  center: [694118.1989320087, 6829154.600371235],
  zoom: 16,
  // projection: "EPSG:4326",
  //Delden:743345.6427273116,6844779.718830286
  //Hengelo:757391.5712651528,6844752.293851171
});

const layer = new TileLayer({
  source: new OSM(),
})

const map = new Map({
  target: 'map',
  view,
  layers: [layer]
})

//点击事件，选择按钮元素
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