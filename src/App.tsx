import React from 'react';
import { Map, TileLayer } from 'react-leaflet';

import shp from 'shpjs';
// import './App.css';
import RoutingMachine from './RoutingMachine';

// const OSRM = require('osrm');
// import getJson from './gis_osm_railways_free_1.json';
// import getJson from './roadGraph.json';
// import { geoJSON } from 'leaflet';

// const data = getJson as GeoJSON.GeoJsonObject;

interface ILocation {
    lat: number;
    lng: number;
}

interface IState {
    roadLoaded: boolean;
    error?: Error;
    bikes?: any;
    zoom: number;
    location: ILocation;
}

export default class App extends React.Component<any, IState> {
    protected roadGeoData?: GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[] = undefined;
    protected map = React.createRef<any>();
    constructor(props: any) {
        super(props);
        this.state = {
            bikes: undefined,
            roadLoaded: false,
            // Novosibirsk location & zoom
            location: {
                lat: 55.031,
                lng: 82.9,
            },
            zoom: 14,
            error: undefined,
        };
    }

    componentDidMount() {
        fetch('https://bikewise.org:443/api/v2/locations/markers?proximity_square=10')
            .then((response) => response.json())
            .then((data) => this.setState({ bikes: data }));

        shp('files/RoadGraph')
            .then((geojson: any) => {
                this.roadGeoData = geojson;
                this.setState({ roadLoaded: true });
            })
            .catch((error: Error) => {
                this.setState({ error });
            });
    }

    render() {
        const { bikes, roadLoaded } = this.state;
        const position: [number, number] = [this.state.location.lat, this.state.location.lng];

        // const osrm = new OSRM('kor.osrm');
        
        return (
            <div>
                <Map className="map" center={position} zoom={this.state.zoom} ref={this.map}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <RoutingMachine map={this.map} />
                    {/* {bikes && (
                        <GeoJSON
                            data={bikes}
                            style={() => ({
                                color: 'red',
                                weight: 1,
                                fillColor: 'yellow',
                                fillOpacity: 1,
                            })}
                        />
                    )}
                    {roadLoaded && this.roadGeoData && (
                        <GeoJSON
                            data={this.roadGeoData}
                            style={() => ({
                                color: 'blue',
                                weight: 1,
                            })}
                        />
                    )} */}
                </Map>
            </div>
        );
    }
}
