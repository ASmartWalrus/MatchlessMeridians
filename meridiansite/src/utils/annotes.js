// This layer mechanism could use some reworking to be faster
export function convert_annotes(kf_list, locations) {
  let layers = [[]]
  
  for (const [i, v] of locations.entries()) {
    let kf = kf_list[i];
    let start = v;
    let end = v + kf.mstring.length;
    if (start == end) {
      continue;
    }
    let inserted = false;
    for (const c_layer of layers) {
      if (!c_layer.some((other) => Math.min(other[2], end) > Math.max(other[1], start))) {
        c_layer.push([kf, start, end]);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      layers.push([[kf, start, end]]);
    }
  }
    return layers;
}
