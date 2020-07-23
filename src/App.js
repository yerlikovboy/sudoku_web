import React from 'react';
import './App.css';

class CellDef {
  idx = -1;
  isSelected = false;
  value = null;

  constructor(idx) {
    this.idx = idx;
    this.isSelected = idx === 0 ? true : false;
    this.value = idx + 1;
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
  return (
    <div
      className={props.selected ? 'cell selected' : 'cell'}
      onClick={props.clicker}
    >
      {props.value}
    </div>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    // key capture on "document"
    var d = document.getRootNode();
    d.onkeydown = (e) => this.updateValue(e, this);

    this.state = {
      cells: Array.from(Array(9), (_, i) => new CellDef(i)),
      selected: 0,
    }
  }

  updateValue(e, o) {
    if (o.state.selected !== -1) {
      var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
      if ((charCode >= 49 && charCode <= 57) || charCode === 8) {
        console.log('pressed key: ' + e.key);
        const c = o.state.cells.slice();
        c[o.state.selected].value = charCode === 8 ? null : e.key;
        o.setState({
          cells: c,
        })
      } else {
        console.log('invalid input: ' + e.keyCode);
      }
    } else {
      console.log('nothing selected');
    }
  }

  renderCell(i) {
    const c = this.state.cells[i];
    return <Cell
      selected={c.isSelected}
      idx={c.idx}
      value={c.value}
      clicker={() => this.updateSelected(i)}
    />
  }

  updateSelected(idx) {
    if (idx !== this.state.selected) {
      const curr_cells = this.state.cells.slice();
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

  render() {
    return (
      <div className="board" id="puzzle_board">
        <div className="board-row">
          {this.renderCell(0)}
          {this.renderCell(1)}
          {this.renderCell(2)}
        </div>
        <div className="board-row">
          {this.renderCell(3)}
          {this.renderCell(4)}
          {this.renderCell(5)}
        </div>
        <div className="board-row">
          {this.renderCell(6)}
          {this.renderCell(7)}
          {this.renderCell(8)}
        </div>
      </div>
    );
  }

}
class App extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="title">Single 3x3 box</div>
        <Board />
      </div>
    )
  }
}

export default App;
