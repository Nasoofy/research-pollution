import React, {useState, useEffect} from 'react';
import { DeckGL } from '@deck.gl/react';
import { Map} from 'react-map-gl/maplibre';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import './App.css';
import Papa from "papaparse";




const MAP_STYLE= 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const INTIAL = {
  longitude: -73.9851,
  latitude: 40.7589,
  zoom: 9,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};


function App(){
  const[intensity, setIntensity] = useState(1);
  const[radius, setRadius] = useState(5);
  const[threshold,setThreshold] = useState(0.03);

  export default function MapwithCSV(){
    const[data, setData] = useState([]);
    useEffect(() => {
      fetch("synthetic_pollution_california_timeseries.csv")
      .then((res) =>res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {header: true}).data;
        const cleanData = parsed
        .filter((d) => d.latitude && d.longitude)
      });
    },[]);
  
    return (
      
    )
  }

  const layers =[
    new HeatmapLayer({
      id: 'heatmapLayer',
      data: DATA_URL,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
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
        NYC Uber Pickups Heatmap
      </div>
      
      <div className="control-panel">
        <h2>Uber pickup in NYC</h2>
        <p>From:April 2014 to Septemeber 2014.</p>
      
        <div className="sliders">
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