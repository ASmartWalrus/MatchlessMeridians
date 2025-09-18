import "@/styles/Solver/Solver.scss"
import BaseGame from "@/assets/BaseGame.json"
import KungFuList from "@/components/Solver/KungFuList.jsx"
import KungFuSolution from "./KungFuSolution";
import init, { init_solver, step_solver } from '@/pkg/rustwasm';
import { useState } from "react";

function Solver() {
  // Could do some work to add mods and customs, but not feeling it
  const baseGameKungfus = Object.entries(BaseGame).
    map(([key, value]) => ({ name : key, meridians : value.split('').map((c) => {
      switch(c) {
      case "1":
        return "◎"
      case "2":
        // code block
        return "△"
      default:
        return "◻"
      } 
    }),
    toggled : false,
    mstring : value
  }));
  const [kfList, setKfList] = useState(baseGameKungfus);

  return (
    <flexbox className="Solver">
      <KungFuList kungfus={kfList} onClick={(i) => {
        setKfList(kfList.map((kf, kf_idx) => {
          if (i === kf_idx) {
            return { ...kf, toggled : !kf.toggled };
          } else {
            return kf;
          }
        }));
      }}/>
      <KungFuSolution/>
    </flexbox>
  )
}

export default Solver
