import "@/styles/Solver/KungFuButton.scss?style"

function KungFuButton({name, meridians, toggled, onClick}) {
  return (
    // I prolly need to swap out how off and on is done
    <button className={`KungFuButton ${toggled ? "on" : "off"}`} onClick={onClick}>
      <h4>{name}</h4>
      <p>{meridians != '' ? meridians : 'None'}</p>
    </button>
  )
}

export default KungFuButton
