import "@/styles/Solver/SolutionAcupoints.scss?style"

function SolutionAcupoints({mstring}) {
  // Probably gonna have to abuse some in-line CSS here
  // to allow for multi-spanning columns grid items
  return (
    <div className="SolutionAcupoints" style={{"width" : mstring != null ? `${mstring.length * 4}rem` : "100%"}}>
      {mstring != null ? mstring.split("").map(c =>
        <div className="acupoint">
          <span>
            {c}
          </span>
        </div>
      ) : ""}
    </div>
  )
}

export default SolutionAcupoints
