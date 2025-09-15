import "@/styles/Solver/KungFuList.scss"
import KungFuButton from "@/components/Solver/KungFuButton.jsx"

function KungFuList({kungfus, onClick}) {
  return (
    <div className="KungFuList">
      <ul>
        {kungfus.map(kf =>
          <li>
              <KungFuButton name={kf.name} meridians={kf.meridians} onClick={onClick} />
          </li>
        )}
      </ul>
    </div>
  )
}

export default KungFuList
