// Inisialisasi Peta
const map = L.map('map').setView([-6.82932, 108.72814], 13);

// 1. Basemap OSM
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Basemap Google Satellite (UPDATED to HTTPS)
const baseMapGoogle = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps'
});

// 3. Basemap Google Streets (UPDATED to HTTPS)
const baseMapGoogleStreets = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps'
});

// Fitur Tambahan
map.addControl(new L.Control.Fullscreen());

L.easyButton('fa-home', function (btn, map) {
    map.setView([-6.82932, 108.72814], 13);
}, 'Zoom Home').addTo(map);

L.control.locate({
    locateOptions: { enableHighAccuracy: true }
}).addTo(map);

/* --- LOAD DATA GEOJSON --- */

// Layer Group untuk Jalan
const jalanLayer = L.geoJSON(null, {
    style: {
        color: "red",
        weight: 2,
        opacity: 1
    },
    onEachFeature: function (feature, layer) {
        let pjg = feature.properties.panjang_m ? feature.properties.panjang_m.toFixed(2) : "0";
        layer.bindPopup(`<b>Jalan Lingkungan</b><br>Panjang: ${pjg} m`);
    }
});

// Ambil data Jalan.geojson
$.getJSON("asset/Jalan.geojson", function (data) {
    jalanLayer.addData(data);
    jalanLayer.addTo(map);
}).fail(function() {
    console.log("Error: File Jalan.geojson tidak ditemukan di folder asset/");
});

// Layer Group untuk Persil
const persilLayer = L.geoJSON(null, {
    style: {
        fillColor: "yellow",
        fillOpacity: 0.4,
        color: "black",
        weight: 1
    },
    onEachFeature: function (feature, layer) {
        let props = feature.properties;
        let content = `
            <b>Pemilik:</b> ${props.Pemilik || '-'}<br>
            <b>NIB:</b> ${props.NIB || '-'}<br>
            <b>Luas:</b> ${props.Luas__m_ ? props.Luas__m_.toFixed(2) : '-'} m²<br>
            <b>Desa:</b> ${props.Desa || '-'}
        `;
        layer.bindPopup(content);
    }
});

// Ambil data Persil.geojson
$.getJSON("asset/Persil.geojson", function (data) {
    persilLayer.addData(data);
    persilLayer.addTo(map);
}).fail(function() {
    console.log("Error: File Persil.geojson tidak ditemukan di folder asset/");
});

/* --- KONTROL LAYER --- */
const baseMaps = {
    "OpenStreetMap": basemapOSM,
    "Google Satellite": baseMapGoogle,
    "Google Streets": baseMapGoogleStreets
};

const overlayMaps = {
    "Jaringan Jalan": jalanLayer,
    "Bidang Tanah (Persil)": persilLayer
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

/* --- LEGENDA --- */
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML = `
        <h4>Legenda</h4>
        <div><span style="background:red; width:20px; height:3px; display:inline-block; margin-right:5px;"></span> Jalan</div>
        <div><span style="background:yellow; width:15px; height:15px; display:inline-block; border:1px solid black; margin-right:5px;"></span> Persil</div>
    `;
    return div;
};
legend.addTo(map);

/* --- FUNGSI INTERAKSI --- */
function zoomToFeature(lat, lng) {
    map.flyTo([lat, lng], 19, {
        animate: true,
        duration: 1.5
    });
    // Scroll otomatis ke peta
    document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
}