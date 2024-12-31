interface Props {
  strikeClass: string | undefined;
}

const Strike = ({ strikeClass }: Props) => {
  return <div className={`strike ${strikeClass}`} />
};

export default Strike;
