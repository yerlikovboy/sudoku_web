import React from "react";
import "./Board.css";
import Board from "./Board.js";

class App extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="title">9x9 Sudoku Board</div>
        <Board />
      </div>
    );
  }
}

export default App;
