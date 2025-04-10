//在浏览器页面中引入地图
import './style.css';
import 'ol/ol.css';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Style, Stroke, Fill, Circle as CircleStyle, } from 'ol/style.js';

// 👉 注册 EPSG:28992 投影支持
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4'; // 引入 OpenLayers 的投影注册方法
import { get as getProjection } from 'ol/proj'; // 引入 OpenLayers 的获取投影定义的工具方法（用于调试或确认）
import { fromLonLat, transform } from 'ol/proj';

proj4.defs("EPSG:28992", "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.2369,50.0087,465.658,0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +units=m +no_defs");
register(proj4);


console.log('✅ EPSG:28992 已注册:', getProjection('EPSG:28992'));

// 创建船只图层
// import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay.js';


// =============== 创建地图对象 ==================

const view = new View({
  center: [694118.1989320087, 6829154.600371235],
  zoom: 16,
  projection: 'EPSG:3857',
  // projection: 'EPSG:28992' ,
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
    view.setZoom(16);
    osmLayer.setVisible(true);
    esriLayer.setVisible(false);
  };
}

const btnDelden = document.querySelector('.btnsDelden button');
if (btnDelden) {
  btnDelden.onclick = function () {
    view.setCenter([743345.6427273116, 6844779.718830286]);
    view.setZoom(16);
    osmLayer.setVisible(true);
    esriLayer.setVisible(false);
  };
}

const btnHengelo = document.querySelector('.btnsHengelo button');
if (btnHengelo) {
  btnHengelo.onclick = function () {
    view.setCenter([757391.5712651528, 6844752.293851171]);
    view.setZoom(16);
    osmLayer.setVisible(true);
    esriLayer.setVisible(false);
  };
}

// =============== 地图底图层 ==================
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

// =============== 加载 GeoJSON 矢量图层 ==================

// berth
fetch('https://geodata.zuid-holland.nl/geoserver/verkeer/wfs?request=GetFeature&service=WFS&version=2.0.0&outputFormat=application%2Fjson&typeNames=ABS_VW_STEIGERS')
  .then(response => response.json())
  .then(data => {
    const geojsonFormat = new GeoJSON();
    const features = geojsonFormat.readFeatures(data, {
      // ✅ 明确声明数据原始坐标系是 EPSG:28992
      dataProjection: 'EPSG:28992',
      // ✅ 显示在地图上的坐标系为墨卡托
      featureProjection: 'EPSG:3857'
    });

    const vectorSource = new VectorSource({
      features: features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({ color: '#ff6600', width: 2 }),
        fill: new Fill({ color: 'rgba(255, 165, 0, 0.3)' })
      })
    });

    map.addLayer(vectorLayer);

    // 自动缩放到矢量范围
    map.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] });
  })
  .catch(err => {
    console.error('❌ 加载 GeoJSON 数据失败:', err);
  });

  const test = transform([155000, 463000], 'EPSG:28992', 'EPSG:3857');
console.log('荷兰中心（墨卡托）:', test);


// 船只图层

// 创建 tooltip overlay
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
const overlay = new Overlay({
  element: tooltip,
  offset: [10, 0],
  positioning: 'bottom-left'
});
map.addOverlay(overlay);

// 船只样式
const shipStyle = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: 'blue' }),
    stroke: new Stroke({ color: '#fff', width: 2 })
  })
});

// 获取数据并渲染
fetch('http://localhost:5000/api/ships')
.then(res => res.json())
  .then(data => {
    const features = data.map(ship => {
      const coords = fromLonLat([ship.lon, ship.lat]);
      const feature = new Feature({
        geometry: new Point(coords),
        name: ship.name,
        info: `Name: ${ship.name}<br>
               dimA: ${ship.dimA}, dimB: ${ship.dimB}, dimC: ${ship.dimC}, dimD: ${ship.dimD}<br>
               COG: ${ship.cog}, SOG: ${ship.sog}<br>
               posTS: ${ship.posTS}<br>
               ISRS Name: ${ship.positionISRSName ?? 'N/A'}`
      });
      feature.setStyle(shipStyle);
      return feature;
    });

    const vectorSource = new VectorSource({ features });
    const vectorLayer = new VectorLayer({ source: vectorSource });
    map.addLayer(vectorLayer);

    // 鼠标悬停事件
    map.on('pointermove', function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (feature) {
        const coordinates = evt.coordinate;
        overlay.setPosition(coordinates);
        tooltip.innerHTML = feature.get('info');
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    });
    console.log('✅ 获取船只数据:', data);
  });
