import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// TODO: get this from ws...
const puzzle_object = {
  _id: "2bcbe1df9fa759dd48624772f20675bb",
  n_clues: 38,
  grid: [6, 7, 3, 1, 0, 0, 5, 0, 2, 0, 8, 0, 0, 7, 0, 4, 0, 1, 0, 0, 9, 0, 0, 2, 6, 0, 0, 3, 0, 1, 7, 6, 8, 0, 4, 0, 0, 6, 0, 0, 2, 0, 8, 0, 0, 0, 2, 0, 3, 0, 5, 0, 6, 0, 0, 0, 6, 5, 0, 7, 0, 0, 0, 0, 5, 0, 2, 3, 0, 0, 0, 6, 0, 4, 0, 0, 1, 0, 3, 5, 8],
  solution_id: "1487cfc08282b4630d9c35682c392a5f",
};

console.log("calling fetch");
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

      // ReactDOM.render(
      //   < App puzzle={result} />,
      //   document.getElementById("root")
      // );
    },
    (error) => {
      console.error(error);
    }
  );


ReactDOM.render(
  < App puzzle={puzzle_object} />,
  document.getElementById("root")
);