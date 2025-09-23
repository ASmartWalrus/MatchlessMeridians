export function meridian_format(s) {
  return s.split('').map((c) => {
    switch(c) {
      case "1":
        return "◎"
      case "2":
        return "△"
      default:
        return "◻"
    } 
  }).join("")
}

