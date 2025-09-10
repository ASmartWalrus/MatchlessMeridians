package solver

import (
	"fmt"
	kungfu "gowasm/kungfu"
)

// Permutation Code adapted from Paul Hankin at SO
// https://stackoverflow.com/a/30230552
// Returns left-most change
func nextPerm(p []int) int {
	for i := len(p) - 1; i >= 0; i-- {
		if i == 0 || p[i] < len(p)-i-1 {
			p[i]++
			return i
		}
		p[i] = 0
	}
	return -1
}

// Generate the next permutation where item at idx is different
// Returns left-most
func nextPermDiffAtIdx(p []int, idx int) int {
	for i := len(p) - 1; i > idx; i-- {
		p[i] = 0
	}
	for i := idx; i >= 0; i-- {
		if i == 0 || p[i] < len(p)-i-1 {
			p[i]++
			return i
		}
		p[i] = 0
	}
	return -1
}

func getPerm(kfs []kungfu.KungFu, p []int) []kungfu.KungFu {
	result := make([]kungfu.KungFu, len(kfs))
	copy(result, kfs)
	for i, v := range p {
		result[i], result[i+v] = result[i+v], result[i]
	}
	return result
}

// I should probably add a greedy implmentation internally as a good seed
// for unusedKfs
func SolveKfs(kfs []kungfu.KungFu, memo OverlapMemoTable) {
	unusedKfs := []kungfu.KungFu{}
	for _, kf := range kfs {
		mergeable := false
		for _, olap := range memo.OverlapMap()[kf.MeridianBits()] {
			if olap >= 0 {
				mergeable = true
				break
			}
		}
		if !mergeable {
			unusedKfs = append(unusedKfs, kf)
		}
	}

	kfLenStore := make([]int, len(unusedKfs))
	lenToBeat := 10000 // If someone is doing this with 10000 meridians, something else has gone catastrophically wrong
	permToBeat := unusedKfs
	changeIdx := 0
	perm := unusedKfs
	runs := 0
	for p := make([]int, len(unusedKfs)); p[0] < len(p); {
		runs = runs + 1
		if runs > 10000000 {
			fmt.Println(p)
			fmt.Println(permToBeat)
			fmt.Println(lenToBeat)
			fmt.Println(kfLenStore)
			runs = 0
		}

		fastQuit := false
		for i := changeIdx; i < len(unusedKfs); i++ {
			if i == 0 {
				kfLenStore[0] = perm[0].Length()
			} else {
				overlapPt, _ := memo.GetOverlap(perm[i-1], perm[i])
				kfLenStore[i] = kfLenStore[i-1] - (perm[i-1].Length() + overlapPt) + perm[i].Length()
			}
			if kfLenStore[i] >= lenToBeat {
				// Try next permutation that's different at index i
				changeIdx = nextPermDiffAtIdx(p, i)
				perm = getPerm(unusedKfs, p)
				fastQuit = true
				break
			}
		}

		if fastQuit {
			continue
		}

		lenToBeat = kfLenStore[len(unusedKfs)-1]
		permToBeat = perm
		// Try next lexigraphic permutation
		changeIdx = nextPerm(p)
		perm = getPerm(unusedKfs, p)
	}
	fmt.Println(permToBeat)
}
