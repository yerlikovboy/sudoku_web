import React from "react";
import "./css/Board.css";
import { Cell } from "./Cell.js";

const blockMap = [
  [0, 1, 2, 9, 10, 11, 18, 19, 20],
  [3, 4, 5, 12, 13, 14, 21, 22, 23],
  [6, 7, 8, 15, 16, 17, 24, 25, 26],

  [27, 28, 29, 36, 37, 38, 45, 46, 47],
  [30, 31, 32, 39, 40, 41, 48, 49, 50],
  [33, 34, 35, 42, 43, 44, 51, 52, 53],

  [54, 55, 56, 63, 64, 65, 72, 73, 74],
  [57, 58, 59, 66, 67, 68, 75, 76, 77],
  [60, 61, 62, 69, 70, 71, 78, 79, 80],
];

class Board extends React.Component {

  renderCell(i, classes) {
    const c = this.props.cells[i];

    return (
      <Cell
        selected={c.isSelected}
        key={c.idx}
        value={c.value}
        isClue={c.isClue}
        num_conflicts={c.conflicts}
        clicker={() => this.props.clickHandler(i)}
      />
    );
  }

  renderPos(i, add_classes) {
    const classes = ["pos"];
    if (typeof add_classes !== "undefined") {
      add_classes.forEach((x) => classes.push(x));
    }

    if (i % 3 === 2) {
      classes.push("row-end");
    }
    return <div key={i} className={classes.join(" ")}>{this.renderCell(i)}</div>;
  }

  generateBlockRow(row_indices, is_bottom_row) {
    if (is_bottom_row) {
      return (
        <div className="row" id="bottom">
          {row_indices.map((x) => this.renderPos(x))}
        </div>
      );
    }
    return (
      <div className="row">{row_indices.map((x) => this.renderPos(x))}</div>
    );
  }

  generateBlock(block_num, is_bottom) {
    let block_indexes = blockMap[block_num];
    const classes = ["block"];

    return (
      <div className={classes.join(" ")} id={"block-" + block_num}>
        {this.generateBlockRow(block_indexes.slice(0, 3))}

        {this.generateBlockRow(block_indexes.slice(3, 6))}

        {this.generateBlockRow(block_indexes.slice(6, 9), true)}
      </div>
    );
  }

  render() {

    return (
      <div className="board">
        <div className="block-3">
          {this.generateBlock(0)}
          {this.generateBlock(1)}
          {this.generateBlock(2)}
        </div>

        <div className="block-3">
          {this.generateBlock(3)}
          {this.generateBlock(4)}
          {this.generateBlock(5)}
        </div>
        <div className="block-3">
          {this.generateBlock(6, true)}
          {this.generateBlock(7, true)}
          {this.generateBlock(8, true)}
        </div>
      </div>
    );
  }
}

export default Board;
