import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

let MAPBOXAPITOKEN =
  "pk.eyJ1IjoiY29kZWl0c2FoaWwiLCJhIjoiY2ppdXBpd2M5MmdoeTNxbWY2bjE3YjdkciJ9.H-1BuVbMltskdDyx25t0Cw";

let dummyData = [
  {
    lat: 28.6216,
    lon: 77.0551,
    time: "Subha ke 9 baje"
  },
  {
    lat: 28.6663,
    lon: 77.068,
    time: "Raat ke 10 baje"
  }
];

const Map = props => {
  try {
    let { locations, len } = props;
    // Just a check to make sure that the arr has some locations
    if (len && len > 0) {
      locations = locations.map(location => ({
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon),
        time: parseFloat(location.time)
      }));
      let [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: locations[0].lat,
        longitude: locations[0].lon,
        zoom: 14
      });
      let [selectedLocation, setSelectedLocation] = useState(null);
      return (
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={MAPBOXAPITOKEN}
          mapStyle="mapbox://styles/codeitsahil/ck13yds5c0k4r1clmitogdcy9"
          onViewportChange={viewport => {
            setViewport(viewport);
          }}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              latitude={location.lat}
              longitude={location.lon}
            >
              <div>
                <img
                  onClick={e => {
                    setSelectedLocation(location);
                  }}
                  src="/icons/placeholder.png"
                  className="icon"
                />
              </div>
            </Marker>
          ))}

          {selectedLocation ? (
            <Popup
              onClose={e => {
                setSelectedLocation(null);
              }}
              latitude={selectedLocation.lat}
              longitude={selectedLocation.lon}
            >
              <div>
                <p>
                  <strong>Latitude</strong>: {selectedLocation.lat}
                </p>
                <p>
                  <strong>Longitude</strong>: {selectedLocation.lon}
                </p>
                <p>
                  <strong>Time</strong>: {selectedLocation.time}
                </p>
              </div>
            </Popup>
          ) : null}
        </ReactMapGL>
      );
    } else {
      return <div>No Data To Show</div>;
    }
  } catch (e) {
    return <div>{e.message}</div>;
  }
};

function App(props) {
  let [data, setData] = useState({});
  useEffect(() => {
    fetch("/api/data")
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log("ERROR IN RESPONSE - ", res);
          throw new Error(`ERROR - ${res.statusText}`);
        }
      })
      .then(json => {
        console.log(json);
        setData(json);
      })
      .catch(e => {
        console.log(e.message);
      });
  }, []);

  console.log(data);
  return (
    <div>
      {data.len || data.len > 0 ? (
        <Map {...data} />
      ) : (
        <div>No Data to show</div>
      )}
    </div>
  );
}

ReactDOM.render(
  <App heading="Header" para="Para" />,
  document.getElementById("app")
);
