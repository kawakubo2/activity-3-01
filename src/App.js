import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tileCount: 12,
      flipCount: 0,
      blocked: false,
      firstFlipTile: {},
      defaultColor: '#F5F5F5',
      flipedColor: '#FFFFE0',
      matchedColor: '#EEEEFF',
      unMatchedColor: '#D3D3D3',
      tiles: []
    }
    for (let i = 0; i < this.state.tileCount; i++) {
      this.state.tiles.push({index: i, number: 0, bgColor: 'white', matched: false, fliped: false});
    }
    this.setNumberToTile();
    this.displayTile = this.displayTile.bind(this);
  }
  flipTile(index) {
    // setTimeoutが終わるまでフリップできないようにする
    if (this.state.blocked) return;
    let flipCount = this.state.flipCount;
    let firstFlipTile = this.state.firstFlipTile;
    let tiles = this.state.tiles;
    let tile = tiles[index];
    // 既にマッチしたカードは無視する
    if (tile.matched) return;
    // 反転させているカードの枚数をカウントアップ
    flipCount++;
    tile.fliped = true
    tile.bgColor = this.state.flipedColor;
    if (flipCount === 1) {
      tile.bgColor = this.state.flipedColor;
      firstFlipTile = tile;
    } else if (flipCount === 2) {
      console.log(`first: ${firstFlipTile.number} second: ${tile.number}`);
      // 同じカードをフリップした場合、flipCountを元に戻しメソッドを抜ける
      // ダブルクリックにも対応
      if (tile.index === firstFlipTile.index) {
        flipCount--;
        this.setState( {flipCount: flipCount })
        return; 
      }
      if (firstFlipTile.number === tile.number) {
        firstFlipTile.matched = true;
        tile.matched = true;
      } else {
        firstFlipTile.bgColor = this.state.unMatchedColor;
        tile.bgColor = this.state.unMatchedColor;
        firstFlipTile.matched = false;
        tile.matched = false;
      }
      flipCount = 0;
      // setTimeoutの処理が終わるまでフリップできないようにblockedフラグをtrueにする
      this.setState({ blocked: true});
      setTimeout(() => {
        tiles.forEach((tile, index) => {
          if (tile.matched) {
            tile.bgColor = this.state.matchedColor;
          } else {
            tile.bgColor = this.state.defaultColor;
            tile.fliped = false;
          }
        });
        // setTimeoutが終わったら、フリップできるようblockedフラグをfalseにする
        this.setState( { tiles: tiles, blocked: false } )
      }, 500);
    } else {
      throw new Error('flipCount out of range Error.')
    }
    this.setState( {flipCount: flipCount, firstFlipTile: firstFlipTile, tiles: tiles})
  }
  componentDidUpdate(prevProps, prevState) {
  }
  // Fisher-Yates shuffle
  shuffleArray(numbers) {
    for (let i = numbers.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
  }
  generateRandomNumber() {
    const generatedNumers = new Set();
    let numbers = [];
    while (generatedNumers.size < this.state.tileCount / 2) {
      let rand = Math.floor(Math.random() * this.state.tileCount + 1) + 1;
      if (!generatedNumers.has(rand)) {
        generatedNumers.add(rand);
        numbers.push(rand);    
        numbers.push(rand);    
      }
    }
    this.shuffleArray(numbers);  
    return numbers;
  }
  setNumberToTile() {
    const numbers = this.generateRandomNumber();
    const tiles = this.state.tiles.map((tile, index) => tile.number = numbers[index]);
    this.setState( { tiles });
  }
  displayTile(index) {
    let tile = this.state.tiles[index];
    return (
      <div className="Tile" style={{ backgroundColor: tile.bgColor }} key={`t-${index}`} onClick={() => 
        this.flipTile(index)}>{(tile.matched || tile.fliped) ? tile.number: ''}</div>
    );
  }
  render() {
    return (
      <div className="App">
        <h1>Memory Match Game</h1>
        <hr />
        {this.state.tiles.map((tile, index) => this.displayTile(index))}     
      </div>
    );
  }
}

export default App;
