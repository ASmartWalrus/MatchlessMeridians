import "@/styles/Solver/KungFuSolution.scss?style"
import { useEffect, useRef, useState } from "react"
import WasmWorker from "@/utils/wasm.worker.js?worker"
import { meridian_format } from "@/utils/mstring.js";
import SolutionAcupoints from "@/components/Solver/SolutionAcupoints.jsx"
import { convert_annotes } from "../../utils/annotes";


function KungFuSolution({kfList}) {
  const inputKfs = useRef(null);
  const worker = useRef(null);
  const ssRef = useRef(null);
  const [solView, setSolView] = useState(null);

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
        if (ss.stage == "Init") {
          return {
            total_kfs : ss.kfs.length,
            memoed : false,
            filtered : false,
            greeded : false,
            bruted : false,
            greed_solution : "",
            greed_annotes : [],
            best_solution : "",
            best_annotes : [],
          }
        }
  

        let newSolView = {
          total_kfs : ss.kfs.length,
          memoed : prev.memoed || ss.stage == "Memoed",
          filtered : prev.filtered || ss.stage == "Filtered",
          greeded : prev.greeded || ss.stage == "BruteSolving",
          bruted : prev.bruted || ss.stage == "Finished",
          greed_solution : prev.greed_solution,
          greed_annotes : prev.greed_annotes,
          best_solution : prev.best_solution,
          best_annotes : prev.best_annotes,
        }

        // Greedy finished
        if (ss.stage == "BruteSolving" && !prev.greeded) {
            newSolView.greed_solution = meridian_format(ss.greedy_solution.mstring);
            newSolView.greed_annotes = convert_annotes(inputKfs.current, ss.greedy_solution.locations);
            newSolView.best_solution = meridian_format(ss.min_solution.mstring);
            newSolView.best_annotes = convert_annotes(inputKfs.current, ss.min_solution.locations);
        }
        
        // Bruting
        if ((ss.stage == "BruteSolving" || ss.stage == "Finished") && ss.min_solution.mstring.length < prev.best_solution.length) {
          newSolView.best_solution = meridian_format(ss.min_solution.mstring);
          newSolView.best_annotes = convert_annotes(inputKfs.current, ss.min_solution.locations);
        }
        
        return newSolView;
      });
    }

    return () => {
      worker.current.terminate();
    };
  }, []);

  useEffect(() => {
    inputKfs.current = kfList.filter((v) => v.toggled);
    worker.current.postMessage(inputKfs.current.map((v) => v.mstring));
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
            <SolutionAcupoints mstring={solView.greed_solution} annotes={solView.greed_annotes}/>
            <h2>Best Solution {solView.bruted ? "" : "So Far "}({solView.greeded ? solView.best_solution.length : "?"} Acupoints):</h2>
            <SolutionAcupoints mstring={solView.best_solution} annotes={solView.best_annotes}/>
          </div>
        : <h1>A Solution Will Appear Here After You Select atleast 2 Inner KungFus</h1>}
      </div>
    </div>
  )
}

export default KungFuSolution
