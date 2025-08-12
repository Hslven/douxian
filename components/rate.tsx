import './rate.css'
export default function Rate({value}: {value: number}) {
  return (
    <div className="flex game-rate">
        {
            Array.from({length:5}).map((_,index) => <img key={index} className="game-rate-item" src={`./images/rate${index + 1 > value ? 0: 1 }.png`} />)
        }
    </div>
  );
}
