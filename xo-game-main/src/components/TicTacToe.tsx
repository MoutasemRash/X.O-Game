import { useEffect, useState } from "react";
import clickSound from "../sounds/click.wav";
import gameOverSound from "../sounds/game_over.wav";
import GameState from "../utils/GameState";
import Board from "./Board";
import GameOver from "./GameOver";
import Reset from "./Reset";

const playerX = "X";
const PlayerO = "O";

const winningCombinations = [
  //Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  //Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },

  //Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

const checkWinner = (
  tiles: string[],
  setStrikeClass: React.Dispatch<React.SetStateAction<string | undefined>>,
  setGameState: React.Dispatch<React.SetStateAction<number>>
) => {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      setStrikeClass(strikeClass);
      if (tileValue1 === playerX) {
        setGameState(GameState.playerXWins);
      } else {
        setGameState(GameState.playerOWins);
      }
      return;
    }
  }

  const areAllTilesFilledIn = tiles.every((tile) => tile !== null);
  if (areAllTilesFilledIn) {
    setGameState(GameState.draw);
  }
};

const TicTacToe = () => {
  const [tiles, setTiles] = useState<string[]>(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState<string>(playerX);
  const [strikeClass, setStrikeClass] = useState<string | undefined>();
  const [gameState, setGameState] = useState(GameState.inProgress);
  const [timeLeft, setTimeLeft] = useState<number>(120); // Timer starts from 120 seconds
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false); // Game start state

  const handleTileClick = (index: number) => {
    if (gameState !== GameState.inProgress) return;

    if (tiles[index] !== null) return;

    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    if (playerTurn === playerX) {
      setPlayerTurn(PlayerO);
    } else {
      setPlayerTurn(playerX);
    }
  };

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(playerX);
    setStrikeClass(undefined);
    setTimeLeft(120); // Reset timer to 2 minutes when game is reset
  };

  const startGame = () => {
    setIsGameStarted(true); // Start the game
    setGameState(GameState.inProgress); // Set the game state to in-progress
  };

  // Timer functionality: countdown from 120 seconds (2 minutes)
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (gameState === GameState.inProgress && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); // Decrease the time
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState(GameState.draw); // Set game state to draw when timer reaches 0
    }

    return () => {
      if (timer) clearInterval(timer); // Clean up the timer on component unmount
    };
  }, [gameState, timeLeft]);

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  const gameOverAudio = new Audio(gameOverSound);
  gameOverAudio.volume = 0.2;
  const clickAudio = new Audio(clickSound);
  clickAudio.volume = 0.5;

  useEffect(() => {
    if (tiles.some((tile) => tile !== null)) {
      clickAudio.play();
    }
  }, [tiles, clickAudio]);

  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverAudio.play();
    }
  }, [gameState, gameOverAudio]);

  return (
    <div>
      <h1>Tic Tac Toe</h1>

      {!isGameStarted && (
        <button onClick={startGame} className="start-button">
          Start Game
        </button>
      )}

      {isGameStarted && timeLeft > 0 && (
        <div className="timer">
          Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      )}

      {isGameStarted && timeLeft > 0 && (
        <Board
          strikeClass={strikeClass}
          playerTurn={playerTurn}
          tiles={tiles}
          onTileClick={handleTileClick}
        />
      )}

      <GameOver gameState={gameState} />
      <Reset gameState={gameState} onReset={handleReset} />
    </div>
  );
};

export default TicTacToe;
