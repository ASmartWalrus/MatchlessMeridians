import "@/styles/Solver/KungFuList.scss"
import KungFuButton from "@/components/Solver/KungFuButton.jsx"

function KungFuList({kungfus, onClick}) {
  return (
    <div className="KungFuList">
      <ul>
        {kungfus.map((kf, i) =>
          <li key={i} >
              <KungFuButton name={kf.name} meridians={kf.meridians} toggled={kf.toggled} onClick={() => { onClick(i) }} />
          </li>
        )}
      </ul>
    </div>
  )
}

export default KungFuList
