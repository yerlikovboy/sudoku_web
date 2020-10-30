import React from "react";
import "./css/Board.css";
import { Cell, CellDef } from "./Cell.js";

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;

class Board extends React.Component {
  constructor(props) {
    super();
    console.debug("start Board constructor");

    // key capture on "document"
    let d = document.getRootNode();
    d.onkeydown = (e) => this.handleKeyDown(e, this);

    const c = Array.from(Array(81), (_, i) => new CellDef(i, 0, false));

    let selected_idx = 0; 
    if (typeof props.puzzle !== 'undefined') {
      console.log(`puzzle id: ${props.puzzle._id}`);
      const p = props.puzzle;
      for (let i = 0; i < 81; i++) {
        // TODO: clean this up
        const curVal = p.grid[i];
        const isClue = curVal !== 0;

        //console.debug("idx: " + i + ", value: " + curVal);

        c[i].value = curVal;
        c[i].isClue = isClue;
        if (isClue && c[i].isSelected) {
          c[i].isSelected = false;
          selected_idx = selected_idx + 1;
          c[selected_idx].isSelected = true;
        }
      }

    }

    this.state = {
      cells: c,
      selected: selected_idx,
      blocks: [
        [0, 1, 2, 9, 10, 11, 18, 19, 20],
        [3, 4, 5, 12, 13, 14, 21, 22, 23],
        [6, 7, 8, 15, 16, 17, 24, 25, 26],

        [27, 28, 29, 36, 37, 38, 45, 46, 47],
        [30, 31, 32, 39, 40, 41, 48, 49, 50],
        [33, 34, 35, 42, 43, 44, 51, 52, 53],

        [54, 55, 56, 63, 64, 65, 72, 73, 74],
        [57, 58, 59, 66, 67, 68, 75, 76, 77],
        [60, 61, 62, 69, 70, 71, 78, 79, 80],
      ],
    };
    console.debug("end Board constructor");

  }

  // traverse the array of cells using the confitional and increment functions
  // passed in.
  selectNextCell(cond, incr) {
    const grid = this.state.cells.slice();
    const curr_idx = this.state.selected;

    let i = incr(curr_idx);
    while (cond(i)) {
      if (!grid[i].isClue) {
        console.debug(
          "index of new selected: " + i + ", previous: " + curr_idx
        );
        grid[curr_idx].unselect();
        grid[i].select();

        this.setState({
          cells: grid,
          selected: i,
        });
        break;
      }
      i = incr(i);
    }
    console.debug("unable to find next available cell");
  }

  updateCellValue(new_val) {
    let idx = this.state.selected;
    const grid = this.state.cells.slice();

    let prev_val = grid[idx].value;
    console.log(`idx: ${idx}, prev_val: ${prev_val}, new_val: ${new_val}`);

    if (new_val === prev_val) {
      console.debug("no new update (new value same as old value");
      return;
    }

    grid[idx].reset_conflict();
    grid[idx].peers.forEach((peer) => {
      let peer_val = grid[peer].value;
      if (prev_val !== 0 && peer_val === prev_val) {
        console.log(`remove conflict: idx: ${idx}, peer: ${peer} is same`);
        grid[peer].dec_conflict();
      }

      if (new_val !== 0 && peer_val === new_val) {
        console.log(
          "add conflict: idx: " +
          idx +
          ", peer: " +
          grid[peer].value +
          " is same"
        );
        grid[peer].add_conflict();
        grid[idx].add_conflict();
      }
    });
    grid[idx].value = new_val;
    this.setState({
      cells: grid,
    });
  }

  handleKeyDown(e, o) {
    let charCode = typeof e.which == "number" ? e.which : e.keyCode;
    console.debug("charCode: " + charCode);

    // update cell value
    if (
      (charCode >= 49 && charCode <= 57) ||
      charCode === BACKSPACE_KEY ||
      charCode === DELETE_KEY
    ) {
      this.updateCellValue(
        parseInt(
          charCode === BACKSPACE_KEY || charCode === DELETE_KEY ? 0 : e.key
        )
      );
    } else if (charCode === LEFT_KEY) {
      this.selectNextCell(
        (x) => x >= 0,
        (x) => x - 1
      );
    } else if (charCode === RIGHT_KEY) {
      // move to the right cell
      this.selectNextCell(
        (x) => x < 81,
        (x) => x + 1
      );
    } else if (charCode === DOWN_ARROW_KEY) {
      // move down
      this.selectNextCell(
        (x) => x <= 80,
        (x) => x + 9
      );
    } else if (charCode === UP_ARROW_KEY) {
      // move up
      this.selectNextCell(
        (x) => x >= 0,
        (x) => x - 9
      );
    } else {
      console.log("key pressed " + e.keyCode);
    }
  }

  renderCell(i, classes) {
    const c = this.state.cells[i];

    return (
      <Cell
        selected={c.isSelected}
        key={c.idx}
        value={c.value}
        isClue={c.isClue}
        num_conflicts={c.conflicts}
        clicker={() => this.updateSelected(i)}
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
    return <div className={classes.join(" ")}>{this.renderCell(i)}</div>;
  }

  updateSelected(idx) {
    if (idx !== this.state.selected) {
      const curr_cells = this.state.cells.slice();
      if (curr_cells[idx].isClue === false) {
        curr_cells[idx].select();
        if (this.state.selected !== -1) {
          curr_cells[this.state.selected].unselect();
        }
        this.setState({
          selected: idx,
          cells: curr_cells,
        });
      }
    }
  }

  genRow(start_idx, num_items) {
    const row = [];

    for (let i = start_idx; i < num_items; i++) {
      row.push(this.renderCell(i));
    }
    return <div className="board-row">{row}</div>;
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
    let block_indexes = this.state.blocks[block_num];
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
    const puzzleSolved = this.state.cells.every(
      (x) => x.value !== 0 && x.conflicts === 0
    );
    let status;
    if (puzzleSolved) {
      status = "You solved the puzzle!";
    } else {
      status = "Good luck!";
    }

    return (
      <div>
        <div className="status">{status}</div>

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
      </div>
    );
  }
  //}
}

export default Board;
