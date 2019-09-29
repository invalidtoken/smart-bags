import React, { useEffect, Component } from "react";
import ReactDOM from "react-dom";
import ReactMapGL from "react-map-gl";

let MAPBOXAPITOKEN =
  "pk.eyJ1IjoiY29kZWl0c2FoaWwiLCJhIjoiY2ppdXBpd2M5MmdoeTNxbWY2bjE3YjdkciJ9.H-1BuVbMltskdDyx25t0Cw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 400,
        height: 400,
        latitude: 28.6216,
        longitude: 77.0551,
        zoom: 14
      }
    };
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={MAPBOXAPITOKEN}
        mapStyle="mapbox://styles/codeitsahil/ck13yds5c0k4r1clmitogdcy9"
        onViewportChange={viewport => this.setState({ viewport })}
      />
    );
  }
}

function App(props) {
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
      })
      .catch(e => {
        console.log(e.message);
      });
  });
  return (
    <div>
      <Map />
    </div>
  );
}

ReactDOM.render(
  <App heading="Header" para="Para" />,
  document.getElementById("app")
);
