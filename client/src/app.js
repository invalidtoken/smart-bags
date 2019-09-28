import React, { useEffect } from "react";
import ReactDOM from "react-dom";

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
      <h1>{props.heading}</h1>
      <p>{props.para}</p>
    </div>
  );
}

ReactDOM.render(
  <App heading="Header" para="Para" />,
  document.getElementById("app")
);
