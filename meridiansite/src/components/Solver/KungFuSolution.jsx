import "@/styles/Solver/KungFuSolution.scss?style"
import { useEffect, useRef, useState } from "react"
import WasmWorker from "@/utils/wasm.worker.js?worker"
import { meridian_format } from "@/utils/mstring.js";
import SolutionAcupoints from "@/components/Solver/SolutionAcupoints.jsx"


function KungFuSolution({kfList}) {
  const worker = useRef(null);
  const ssRef = useRef(null);
  const [solView, setSolView] = useState({
    total_kfs : 0,
    memoed : false,
    filtered : false,
    greeded : false,
    finished : false,
    greed_solution : "",
    best_solution : "",
  });

  useEffect(() => {
    worker.current = new WasmWorker();
    worker.current.onmessage = (e) => {
      let ss = e.data;
      ssRef.current = ss;

      if (ss == null) {
        setSolView(null);
        return;
      }

      // A view is preferable due to heavy calc on solution strings and annotations
      setSolView((prev) => {
        if (prev == null) {
          return {
            total_kfs : ss.kfs.length,
            memoed : false,
            filtered : false,
            greeded : false,
            finished : false,
            greed_solution : "",
            best_solution : "",
          }
        }

        return {
          total_kfs : ss.kfs.length,
          memoed : prev.memoed || ss.stage == "Memoed",
          filtered : prev.filtered || ss.stage == "Filtered",
          greeded : prev.greeded || ss.stage == "BruteSolving",
          bruted : prev.bruted || ss.stage == "Finished",
          greed_solution : (prev.greed_solution == "" || ss.greedy_solution.mstring.length < prev.greed_solution.length) ? meridian_format(ss.greedy_solution.mstring) : prev.greed_solution,
          best_solution : (prev.best_solution == "" || ss.min_solution.mstring.length < prev.best_solution.length) ? meridian_format(ss.min_solution.mstring) : prev.best_solution
        }
      });
    }

    return () => {
      worker.current.terminate();
    };
  }, []);

  useEffect(() => {
    worker.current.postMessage(kfList.filter((v) => v.toggled).map((v) => v.mstring));
  }, [kfList]);
  
  return (
    <div className="KungFuSolution">
      <div className="paddiv">
        {solView != null ?
          <div>
            <h1>Solving for {solView.total_kfs} KungFus</h1>
            <h2>Current Progress:</h2>
            <h3>
              <span className="highlight">Initialized</span>
              {" - "}
              <span className={solView.memoed ? "highlight" : "darken"}>Memoized</span>
              {" - "}
              <span className={solView.filtered ? "highlight" : "darken"}>Filtered</span>
              {" - "} 
              <span className={solView.greeded ? "highlight" : "darken"}>Fast Solved</span>
              {" - "} 
              <span className={solView.bruted ? "highlight" : "darken"}>Brute Solved</span>
            </h3>
            <h2>Quick Solution ({solView.greeded ? solView.greed_solution.length : "?"} Acupoints):</h2>
            <SolutionAcupoints mstring={solView.greed_solution}/>
            <h2>Best Solution {solView.finished ? "" : "So Far "}({solView.greeded ? solView.best_solution.length : "?"} Acupoints):</h2>
            <SolutionAcupoints mstring={solView.best_solution}/>
          </div>
        : <h1>A Solution Will Appear Here After You Select atleast 2 Inner KungFus</h1>}
      </div>
    </div>
  )
}

export default KungFuSolution
