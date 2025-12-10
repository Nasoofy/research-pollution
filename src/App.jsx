import React, { useState, useEffect } from 'react';
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
//import { IconLayer } from 'deck.gl/layers';
import './App.css';
import Papa from "papaparse";
import inside from "point-in-polygon";

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const INITIAL = {
  longitude: -119.4179,
  latitude: 36.7783,
  zoom: 6,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

const CALIFORNIA_POLYGON = [
  [-124.482003, 32.528832],
  [-124.482003, 42.009516],
  [-123.233256, 42.009516],
  [-120.000000, 41.995232],
  [-119.994046, 38.994392],
  [-114.633491, 34.875021],
  [-114.634000, 34.003582],
  [-117.128400, 32.534340],
  [-124.482003, 32.528832]
];

function App() {
  const [data, setData] = useState([]);
  const [intensity, setIntensity] = useState(2);
  const [radius, setRadius] = useState(10);
  const [threshold, setThreshold] = useState(0.03);
  const [timestamp, setTimestamp] = useState(0);
  const [showArrows, setShowArrows] = useState(true);
  const [arrowData, setArrowData] = useState([]);

  useEffect(() => {
    fetch("synthetic_pollution_california_timeseries.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true }).data;
        const cleanData = parsed
          .map((d) => ({
            id: Number(d.id),
            longitude: parseFloat(d.longitude),
            latitude: parseFloat(d.latitude),
            value: parseFloat(d.no2_ug_m3),
            time: parseFloat(d.timestamp),
          }))
          .filter((d) =>
            inside([d.longitude, d.latitude], CALIFORNIA_POLYGON)
          );
        setData(cleanData);
      });
  }, []);

  const getWeight = (d) => {
    if (d.value > 30) {
      return d.value*10;
    }
    return d.value*.5;
  };

  const layers = [
    
    new HeatmapLayer({
      id: 'heatmapLayer',
      data: data,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: getWeight,  
      timestamp: (d) => d.timestamp,
      radiusPixels: radius,
      intensity: intensity,
      threshold: threshold,
    })
  ];

  return (
    <div>
      <DeckGL initialViewState={INITIAL} controller={true} layers={layers}>
        <Map reuseMaps mapStyle={MAP_STYLE} />
      </DeckGL>

      <div className="title-overlap">Cali Pollution</div>

      <div className="control-panel">
        <h2>Pollution in Cali</h2>
        <div className="sliders">
          <label>
            Timestamps:
            <input
              type="range"
              min="0"
              value={timestamp}
              onChange={(e) => setTimestamp(Number(e.target.value))}
            />
          </label>
          <label>
            Intensity: {intensity.toFixed(2)}
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
          </label>

          <label>
            Radius: {radius}
            <input
              type="range"
              min="5"
              max="200"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </label>

          <label>
            Threshold: {threshold.toFixed(2)}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;

