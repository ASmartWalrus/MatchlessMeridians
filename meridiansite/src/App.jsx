import Solver from '@/components/Solver/Solver.jsx'
import Footer from '@/components/Footer';
import init from '@/pkg/rustwasm'

init()

function App() {
  return (
    <flexbox>
      <Solver/>
      <Footer/>
    </flexbox>
  )
}

export default App
