import "@/styles/Footer.scss?style"

function Footer({name, meridians, onClick}) {
  return (
    <div className="Footer">
        <div><a href="https://asmartwalrus.github.io/" target="_blank" rel="noopener noreferrer"/></div>
        <a className="Link" href="https://asmartwalrus.github.io/" target="_blank" rel="noopener noreferrer">Walrus's Den</a>
        <a className="Link" href="https://github.com/ASmartWalrus/MatchlessMeridians" target="_blank" rel="noopener noreferrer">Source Code</a>
        <a className="Link" href="https://thematchlesskungfu.wiki.gg/" target="_blank" rel="noopener noreferrer">Matchless KungFu's English Wiki</a>
    </div>
  )
}

export default Footer
