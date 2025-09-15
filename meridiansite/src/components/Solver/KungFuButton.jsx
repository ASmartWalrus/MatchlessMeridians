import "@/styles/Solver/KungFuButton.scss"

function KungFuButton({name, meridians, onClick}) {
  return (
    <button className="KungFuButton" onClick={onClick}>
      <h4>{name}</h4>
      <p>{meridians != '' ? meridians : 'None'}</p>
    </button>
  )
}

export default KungFuButton
