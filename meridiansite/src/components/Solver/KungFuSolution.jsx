import "@/styles/Solver/KungFuSolution.scss"
import { useEffect, useRef, useState } from "react"
import init, { init_solver, step_solver } from '@/pkg/rustwasm';

function KungFuSolution({kfList}) {
  const [solveKfs, setSolveKfs] = useState([])
  const [ss, setSS] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setSS((ss) => {
        if (ss != null) {
          return step_solver(ss)
        }
      })
    }, 200);

    return () => {
      clearInterval(interval)
    }; 
  }, []); 

  useEffect(() => {
    const newSolveKfs = kfList.filter((v) => v.toggled).map((v) => v.mstring)
    setSolveKfs(newSolveKfs)
    if (newSolveKfs.length > 1) {
      setSS(init_solver(newSolveKfs));
    } else {
      setSS(null);
    }
  }, [kfList]);



  return (
    <div className="KungFuSolution">
      <h2>Solving for {solveKfs.length} KungFus</h2>
        {solveKfs.length > 1 ?
          <div>
            {ss.stage}
            <h2>Memo-izing Individual Overlaps: {ss.memo.size > 0 ? `${ss.memo.size * (ss.memo.size - 1)} Overlaps` : "Not Done"} </h2>
            <h2>Filtering Mergeables: {ss.filtered_kf_idxs.length > 0 ? `${ss.kfs.length - ss.filtered_kf_idxs.length} Filtered` : "Not Done"}</h2>
            <h2>Quick Solving: {ss.greedy_mstring.length > 0 ? `${ss.greedy_mstring.split('').map((c) => {
              switch(c) {
              case "1":
                return "◎"
              case "2":
                // code block
                return "△"
              default:
                return "◻"
              } 
            }).join("")} (${ss.greedy_mstring.length})` : "Not Done"} </h2>
            <h2>Brute Solving: {ss.min_mstring.length > 0 ? `${ss.min_mstring.split('').map((c) => {
              switch(c) {
              case "1":
                return "◎"
              case "2":
                // code block
                return "△"
              default:
                return "◻"
              } 
            }).join("")} (${ss.min_mstring.length})` : "Not Done"} </h2>
          </div>
        : "Bruh"}
    </div>
  )
}

export default KungFuSolution
