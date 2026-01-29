// --- Inisialisasi Peta ---
const map = L.map('map').setView([-6.906534, 108.736940], 14);

// 1. Basemap OSM
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Basemap Google Satellite (WAJIB HTTPS)
const baseMapGoogle = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps'
});

// 3. Basemap Google Streets (WAJIB HTTPS)
const baseMapGoogleStreets = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps'
});

// --- Fitur Kontrol ---
map.addControl(new L.Control.Fullscreen());

L.easyButton('fa-home', function (btn, map) {
    map.setView([-6.906534, 108.736940], 14);
}, 'Zoom Home').addTo(map);

L.control.locate({
    locateOptions: { enableHighAccuracy: true }
}).addTo(map);

// --- LOAD DATA GEOJSON ---

// Style untuk Jalan
const styleJalan = {
    color: "#ff3300",
    weight: 3,
    opacity: 0.8
};

// Layer Jalan
const jalanLayer = L.geoJSON(null, {
    style: styleJalan,
    onEachFeature: function (feature, layer) {
        let pjg = feature.properties.panjang_m ? feature.properties.panjang_m.toFixed(2) : "-";
        layer.bindPopup(`
            <div style="text-align:center">
                <b>Jalan Lingkungan</b><br>
                Panjang: ${pjg} m
            </div>
        `);
    }
});

// Panggil Data Jalan (Pastikan file di folder asset bernama 'jalan.geojson' huruf kecil)
$.getJSON("./asset/jalan.geojson", function (data) {
    jalanLayer.addData(data);
    jalanLayer.addTo(map);
    console.log("Data Jalan berhasil dimuat");
}).fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Gagal memuat jalan.geojson: " + errorThrown);
});

// Style untuk Persil
const stylePersil = {
    fillColor: "#ffd700",
    fillOpacity: 0.4,
    color: "#333",
    weight: 1
};

// Layer Persil
const persilLayer = L.geoJSON(null, {
    style: stylePersil,
    onEachFeature: function (feature, layer) {
        let props = feature.properties;
        // Menangani kemungkinan nama field yang berbeda (case sensitive pada geojson properties)
        let pemilik = props.Pemilik || props.pemilik || "Tanpa Nama";
        let nib = props.NIB || props.nib || "-";
        let luas = props.Luas__m_ || props.luas || 0;
        
        let content = `
            <table style="width:100%; font-size:11px;">
                <tr><td colspan="2" style="background:#005f99; color:white; padding:2px; text-align:center;"><b>INFORMASI BIDANG</b></td></tr>
                <tr><td><b>Pemilik</b></td><td>: ${pemilik}</td></tr>
                <tr><td><b>NIB</b></td><td>: ${nib}</td></tr>
                <tr><td><b>Luas</b></td><td>: ${parseFloat(luas).toFixed(1)} m²</td></tr>
                <tr><td><b>Desa</b></td><td>: ${props.Desa || "-"}</td></tr>
            </table>
        `;
        layer.bindPopup(content);
    }
});

// Panggil Data Persil (Pastikan file di folder asset bernama 'persil.geojson' huruf kecil)
$.getJSON("./asset/persil.geojson", function (data) {
    persilLayer.addData(data);
    persilLayer.addTo(map);
    console.log("Data Persil berhasil dimuat");
}).fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Gagal memuat persil.geojson: " + errorThrown);
});


// --- Layer Control ---
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

// --- Legenda ---
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML = `
        <h4>Legenda</h4>
        <div><i style="background:#ff3300; height:3px; margin-top:8px;"></i> Jalan</div>
        <div><i style="background:#ffd700; border:1px solid #333;"></i> Persil Tanah</div>
    `;
    return div;
};
legend.addTo(map);

// --- Fungsi Interaksi Zoom ---
function zoomToFeature(lat, lng) {
    map.flyTo([lat, lng], 18, {
        animate: true,
        duration: 1.5
    });
    // Scroll halus ke elemen peta
    document.getElementById('map').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}
