import React, {useState, useEffect} from 'react';
import { DeckGL } from '@deck.gl/react';
import { Map} from 'react-map-gl/maplibre';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import './App.css';
import Papa from "papaparse";




const MAP_STYLE= 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const INTIAL = {
  longitude: -119.4179,
  latitude: 36.7783,
  zoom: 6,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};


function App(){

    const[data, setData] = useState([]);
    useEffect(() => {
      fetch("synthetic_pollution_california_timeseries.csv")
      .then((res) =>res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {header: true}).data;
        const cleanData = parsed
        .filter((d) => d.latitude && d.longitude)
        .map((d) => ({
          id: Number(d.id),
          longitude : parseFloat(d.longitude),
          latitude : parseFloat(d.latitude),
          value : parseFloat(d.no2_ug_m3),
          time : parseFloat(d.timestamp),
        }));
        .filter((d) =>
            d.latitude >= 32.5 &&
            d.latitude <= 42 &&
            d.longitude >= -124.5 &&
            d.longitude <= -114
        );
        setData(cleanData)
      });
    },[])

  const[intensity, setIntensity] = useState(1);
  const[radius, setRadius] = useState(5);
  const[threshold,setThreshold] = useState(0.03);

  const layers =[
    new HeatmapLayer({
      id: 'heatmapLayer',
      data: data,
      getPosition: d => [d.longitude, d.latitude],
      getWeight: d => d.value,
      timestamp: d => d.timestamp,
      radiusPixels: radius,
      intensity: intensity,
      threshold: threshold,
    })
  ];
  return (
    <div>
      <DeckGL
        initialViewState={INTIAL}
        controller={true}
        layers={layers}
      >
        <Map reuseMaps mapStyle={MAP_STYLE}/>  
      </DeckGL>
      
      <div className="title-overlap">
        Cali Poluation 
      </div>
      
      <div className="control-panel">
        <h2>Poluation in Cali</h2>      
        <div className="sliders">
          <label>
            Timestaps:
            <input
              type="range"
              min = "0"
              //value = {timestamp}
              
            ></input>
          </label>
          <label>
            Intensity: {intensity.toFixed(2)}
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
            />
          </label>
        
          <label>
            Radius: {radius}
            <input
              type="range"
              min="1"
              max="100"
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
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
              onChange={e => setThreshold(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
export default App;