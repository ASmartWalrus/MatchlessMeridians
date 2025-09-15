import "@/styles/Footer.scss"

function Footer({name, meridians, onClick}) {
  return (
    <flexbox className="Footer">
        <a href="https://asmartwalrus.github.io/">Walrus's Den</a>
        <a href="https://github.com/ASmartWalrus/MatchlessMeridians">Source Code</a>
        <a href="https://thematchlesskungfu.wiki.gg/">Matchless KungFu's English Wiki</a>
    </flexbox>
  )
}

export default Footer
