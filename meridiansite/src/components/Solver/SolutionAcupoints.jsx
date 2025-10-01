import "@/styles/Solver/SolutionAcupoints.scss?style"

function SolutionAcupoints({mstring, annotes}) {
  // Probably gonna have to abuse some in-line CSS here
  // to allow for multi-spanning columns grid items
  return (
    <div className="SolutionAcupoints" style={{maxWidth : `min(${mstring.length * 5}rem, 100%)`}}>
      {mstring.split("").map((c, i) =>
        <div key={i} className="acupoint">
          <span>
            {c}
          </span>
        </div>
      )}
      {annotes.map((layer, layer_idx) => 
        layer.map((annote, i) => 
          <div 
            key={`annot-${layer_idx + 1}-${i + 1}`}
            className="annote" style={{gridColumn : `${annote[1] + 1} / ${annote[2] + 1}`, gridRow : `${layer_idx + 2}`}}
            title={annote[0].name}
          />
      ))}
    </div>
  )
}

export default SolutionAcupoints
