import React from 'react';
import './App.css';

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;

class CellDef {
  idx = -1;
  isSelected = false;
  value = null;
  isClue = false;

  constructor(idx, value, isClue) {
    this.idx = idx;
    this.isSelected = idx === 0 ? true : false;
    this.value = value;
    this.isClue = isClue;
  }

  select() {
    this.isSelected = true;
  }

  unselect() {
    this.isSelected = false;
  }

  setValue(v) {
    this.value = v;
  }

  clearValue() {
    this.value = null;
  }
}

function Cell(props) {
  const classes = ['cell'];

  if (props.selected) {
    classes.push("selected");
  }

  if (props.isClue) {
    classes.push("clue");
  }
  return (
    <div
      className={classes.join(' ')}
      onClick={props.clicker}
    >
      {props.value === -1 ? '' : props.value}
    </div>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    // key capture on "document"
    var d = document.getRootNode();
    d.onkeydown = (e) => this.updateValue(e, this);

    const myCells = Array.from(Array(80), (_, i) => new CellDef(i, -1, false));
    myCells.push(new CellDef(80, 9, true));
    this.state = {
      // cells: Array.from(Array(81), (_, i) => new CellDef(i)),
      cells: myCells,
      selected: 0,
    }
  }

  updateSelectedCell(cells, curr_selected, next_selected) {
    const retval = new Object();
    if (cells[next_selected].isClue) {
      retval.isOk = false;
    } else {
      cells[curr_selected].isSelected = false;
      cells[next_selected].isSelected = true;
      retval.isOK = true;
      retval.updated_cells = cells;
    }
    return retval;
  }

  // charCodes:
  // 37 Left Arroy
  // 38 Up Arrow
  // 39 Right Arrow
  // 40 Down Arrow 
  updateValue(e, o) {
    const selected_idx = o.state.selected;

    if (selected_idx <= 0) {
      console.log('invalid selected idx: ' + selected_idx)
    }

    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    // TODO: remove
    //alert(charCode);
    if ((charCode >= 49 && charCode <= 57) || charCode === 8) {
      console.error('pressed key: ' + e.key);
      const c = o.state.cells.slice();
      c[o.state.selected].value = charCode === 8 ? null : e.key;
      o.setState({
        cells: c,
      })
    } else if (charCode === LEFT_KEY) {
      // move to the left cell
      if (selected_idx === 0) {
        console.log("ignore");
      } else {
        // select left
        const c = o.state.cells.slice();
        
        if (c[selected_idx - 1].isClue) {
          console.log("cell " + c[selected_idx].idx + " holds a clue");
          return;
        }
        c[selected_idx].isSelected = false;
        c[selected_idx - 1].isSelected = true;
        o.setState({
          cells: c,
          selected: selected_idx - 1,
        });

      }
    } else if (charCode === RIGHT_KEY) {
      // move to the right cell 
      if (selected_idx === 80) {
        console.log("last cell selected and right move request ignored");
      } else {
        // select right
        const c = o.state.cells.slice();
        if (c[selected_idx + 1].isClue) {
          console.log("cell " + c[selected_idx + 1].idx + " holds a clue");
          return;
        }
        c[selected_idx].isSelected = false;
        c[selected_idx + 1].isSelected = true;
        o.setState({
          cells: c,
          selected: selected_idx + 1,
        });
      }
    } else if (charCode === DOWN_ARROW_KEY) {
      // move down
      if (selected_idx < 72) {
        const c = o.state.cells.slice();

        if (c[selected_idx + 9].isClue) {
          console.log("cell " + c[selected_idx + 9].idx + " holds a clue");
          return;
        }

        c[selected_idx].isSelected = false;
        c[selected_idx + 9].isSelected = true;
        o.setState({
          cells: c,
          selected: selected_idx + 9,
        });
      }

    } else if (charCode === UP_ARROW_KEY) {
      // move up 
      if (selected_idx > 8) {
        const c = o.state.cells.slice();
        c[selected_idx].isSelected = false;
        c[selected_idx - 9].isSelected = true;
        o.setState({
          cells: c,
          selected: selected_idx - 9,
        });
      }
    } else {
      alert('key pressed: ' + e.keyCode);
      console.log('invalid input: ' + e.keyCode);
    }
  }

  renderCell(i) {
    const c = this.state.cells[i];
    return <Cell
      selected={c.isSelected}
      idx={c.idx}
      value={c.value}
      isClue={c.isClue}
      clicker={() => this.updateSelected(i)}
    />
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
          cells: curr_cells
        });
      }
    }
  }


  genRow(start_idx, num_items) {
    const row = [];

    for (let i = start_idx; i < num_items; i++) {
      row.push(this.renderCell(i))
    }
    return <div className="board-row">{row}</div>
  }

  render() {
    return (
      <div className="board" id="puzzle_board">
        {this.genRow(0, 9)}
        {this.genRow(9, 18)}
        {this.genRow(18, 27)}

        {this.genRow(27, 36)}
        {this.genRow(36, 45)}
        {this.genRow(45, 54)}

        {this.genRow(54, 63)}
        {this.genRow(63, 72)}
        {this.genRow(72, 81)}
      </div>
    );
  }

}
class App extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="title">9x9 Sudoku Board</div>
        <Board />
      </div>
    )
  }
}

export default App;
