import React from "react";
import "./Board.css";
import Board from "./Board.js";

export default function App(props) { 
      return (
      <div className="game">
        <div className="title">9x9 Sudoku Board</div>
        <Board puzzle={props.puzzle}/>
      </div>
    );
}
