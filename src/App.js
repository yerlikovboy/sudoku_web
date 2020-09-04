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
      {props.value === 0 ? '' : props.value}
    </div>
  )
}

class Board extends React.Component {
  constructor(props) {
    console.log('start Board constructor')
    super(props);

    // key capture on "document"
    var d = document.getRootNode();
    d.onkeydown = (e) => this.updateValue(e, this);

    this.state = {
      cells: Array.from(Array(81), (_, i) => new CellDef(i, 0, false)),
      selected: 0,
    }
  }

  initBoard(p) {
    const c = this.state.cells.slice();
    for (let i = 0; i < 81; i++) {
      // TODO: clean this up 
      const curVal = p.grid[i];
      const isClue = curVal !== 0;

      console.debug("idx: " + i + ", value: " + curVal);

      c[i].value = curVal;
      c[i].isClue = isClue;
      if (isClue && c[i].isSelected) {
        c[i].isSelected = false;
        c[i + 1].isSelected = true;
      }

    }
    this.setState({
      cells: c,
    })
  }

  componentDidMount() {
    console.log("start componentDidMount");

    //FIXME: Obtaining puzzle has to be refactored.
    fetch("http://localhost:5984/puzzles/08fe4f94e72a51cefad5a6db9d940f8c",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa('admin:Bardop0nd')
        }
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log("retrieved puzzle: " + result._id + ", difficulty: " + result.n_clues);
          //TODO: the initBoard method doesn't belong here. But one nice thing about doing this here is 
          // that the initial board is only used once and is discarded after this (i think ... need to confirm)
          this.initBoard(result);
          this.setState({
            isLoaded: true,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );

    console.log("finish componentDidMount");
  }
  // charCodes:
  // 37 Left Arroy
  // 38 Up Arrow
  // 39 Right Arrow
  // 40 Down Arrow 
  // TODO: clean up
  updateValue(e, o) {
    const selected_idx = o.state.selected;

    if (selected_idx <= 0) {
      console.log('invalid selected idx: ' + selected_idx)
    }

    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    console.debug("charCode: " + charCode);

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
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
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

}
class App extends React.Component {
  //TODO: maybe retrieve the puzzle in here and then pass it to Board at initialization.
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
