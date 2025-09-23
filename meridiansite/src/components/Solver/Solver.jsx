import "@/styles/Solver/Solver.scss"
import BaseGame from "@/assets/BaseGame.json"
import KungFuList from "@/components/Solver/KungFuList.jsx"
import KungFuSolution from "./KungFuSolution";
import { useState } from "react";
import { meridian_format } from "../../utils/mstring";

function Solver() {
  // Could do some work to add mods and customs, but not feeling it
  const baseGameKungfus = Object.entries(BaseGame).
    map(([key, value]) => ({ name : key, meridians : meridian_format(value),
    toggled : false,
    mstring : value
  }));
  const [kfList, setKfList] = useState(baseGameKungfus);

  return (
    <div className="Solver">
      <KungFuList kungfus={kfList} onClick={(i) => {
        setKfList(kfList.map((kf, kf_idx) => {
          if (i === kf_idx) {
            return { ...kf, toggled : !kf.toggled };
          } else {
            return kf;
          }
        }));
      }}/>
      <KungFuSolution kfList={kfList}/>
    </div>
  )
}

export default Solver
