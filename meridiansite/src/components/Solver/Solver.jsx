import "@/styles/Solver/Solver.scss"
import BaseGame from "@/assets/BaseGame.json"
import KungFuList from "@/components/Solver/KungFuList.jsx"
import KungFuSolution from "./KungFuSolution";

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

  return (
    <flexbox className="Solver">
        <KungFuList kungfus={baseGameKungfus}/>
        <KungFuSolution/>
    </flexbox>
  )
}

export default Solver
