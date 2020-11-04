import React from "react";
import ReactDOM from "react-dom";
import Game from "./Game"
import "./css/index.css";

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

