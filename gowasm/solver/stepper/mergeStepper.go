package stepper

import "gowasm/solver"

type MergeStepper struct {
	memo solver.OverlapMemoTable
	step SolveStep
}

// Inject Memo here, could inject per-step but naw
func MakeMergeStepper(memo solver.OverlapMemoTable) {

}

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

func (stepper MergeStepper) SetState() {

}
