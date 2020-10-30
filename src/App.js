import React from "react";
import "./css/Board.css";
import Board from "./Board.js";
import GameController from "./Controls.js"

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      puzzle: props.puzzle,
    }
  }

  render() {
    return (
      <div>
        <div className="game">
          <div className="title">9x9 Sudoku Board</div>
          <Board puzzle={this.state.puzzle} />
        </div>
        <div className="game-controls">
          <GameController />
        </div>
      </div>
    )
  }
}

export default App;
