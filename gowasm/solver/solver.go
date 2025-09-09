package solver

import (
	kungfu "gowasm/kungfu"
)

// Find any kfs mergable into other kfs
// O(n^2)
func findMergable(overlaps map[int]map[int]int) [][2]int {
	mergables := [][2]int{}
	for idx, kfOverlaps := range overlaps {
		for otherIdx, overlapIdx := range kfOverlaps {
			if 0 <= overlapIdx {
				mergables = append(mergables, [2]int{idx, otherIdx})
			}
		}
	}
	return mergables
}

func SolveKfs(kfs *[]kungfu.KungFu) {

}
