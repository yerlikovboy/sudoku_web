import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
// import App from "./App";
import Game from "./Game"

console.log("fetching puzzle");
fetch("http://homelander/potd", {
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then(
    (result) => {
      console.log(
        "retrieved puzzle: " + result._id + ", difficulty: " + result.n_clues
      );

      ReactDOM.render(
        <Game puzzle={result} />,
        document.getElementById("root")
      );
    },
    (error) => {
      console.error(error);
    }
  );

