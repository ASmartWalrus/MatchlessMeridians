import "@/styles/Solver/KungFuSolution.scss?style"
import { useEffect, useRef, useState } from "react"
import WasmWorker from "@/utils/wasm.worker.js?worker"
import { meridian_format } from "../../utils/mstring";

function KungFuSolution({kfList}) {
  const worker = useRef(null);
  const [ss, setSS] = useState(null)

  useEffect(() => {
    worker.current = new WasmWorker();
    worker.current.onmessage = (e) => {
      console.log(e.data)
      setSS(e.data)
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
      {ss != null ?
        <div>
          <h1>Solving for {ss.kfs.length} KungFus</h1>
          <h2>Current Progress:</h2>
          <h3>
            <span className="highlight">Initialized</span>
            {" - "}
            <span className={ss.memo.size > 0 ? "highlight" : "darken"}>Memorized</span>
            {" - "}
            <span className={ss.filtered_kf_idxs.length > 0 ? "highlight" : "darken"}>Filtered</span>
            {" - "} 
            <span className={ss.greedy_mstring.length > 0 ? "highlight" : "darken"}>Fast Solved</span>
            {" - "} 
            <span className={ss.stage == "Finished" ? "highlight" : "darken"}>Brute Solved</span>
          </h3>
          <h2>Quick Solution ({ss.greedy_mstring.length > 0 ? ss.greedy_mstring.length : "?"} Acupoints):</h2>
          <h3>{ss.greedy_mstring.length > 0 ? `${meridian_format(ss.greedy_mstring)}` : "???"}</h3>
          <h2>Best Solution {ss.stage == "Finished" ? "" : "So Far "}({ss.min_mstring.length > 0 ? ss.min_mstring.length : "?"} Acupoints):</h2>
          <h3>{ss.min_mstring.length > 0 ? `${meridian_format(ss.min_mstring)}` : "???"}</h3>
        </div>
      : <h1>A Solution Will Appear Here After You Select atleast 2 Inner KungFus</h1>}
    </div>
  )
}

export default KungFuSolution
