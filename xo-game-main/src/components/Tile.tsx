interface Props {
  className?: string;
  value: string;
  onClick: () => void;
  playerTurn: string;
}

const Tile = ({ className, value, onClick, playerTurn }: Props) => {
  let hoverClass = null;
  if (value === null && playerTurn !== null)
    hoverClass = `${playerTurn.toLowerCase()}-hover`;

  return (
    <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>
      {value}
    </div>
  );
};

export default Tile;
