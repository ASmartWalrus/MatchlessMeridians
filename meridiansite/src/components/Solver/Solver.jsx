import "@/styles/Solver/Solver.scss"
import BaseGame from "@/assets/BaseGame.json"
import KungFuList from "@/components/Solver/KungFuList.jsx"
import KungFuSolution from "./KungFuSolution";
import init, { init_solver, step_solver } from '@/pkg/rustwasm';

function Solver() {
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
    })}));

    init().then(() => {
      const bgkf = Object.entries(BaseGame)
      const all_stuff = Object.entries(BaseGame).
        map(([key, value]) => (value));
      let solver_state = init_solver(all_stuff);
      solver_state = step_solver(solver_state, 3);
      console.log(solver_state.greedy_kf_idxs.map((v) => bgkf[v]))
      console.log(solver_state)
    });

  return (
    <flexbox className="Solver">
      <KungFuList kungfus={baseGameKungfus}/>
      <KungFuSolution/>
    </flexbox>
  )
}

export default Solver
