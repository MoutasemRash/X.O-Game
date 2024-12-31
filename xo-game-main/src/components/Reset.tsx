import GameState from "../utils/GameState";

interface Props {
  gameState: number;
  onReset: () => void;
}

const Reset = ({ gameState, onReset }: Props) => {
  if (gameState === GameState.inProgress) return;

  return (
    <button onClick={onReset} className="reset-button">
      Reset
    </button>
  );
};

export default Reset;
