package solver

import (
	"fmt"
	kungfu "gowasm/kungfu"
	perm "gowasm/solver/permute"
)

func FilterMergeables(kfs []kungfu.KungFu, memo OverlapMemoTable) []kungfu.KungFu {
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
	return unusedKfs
}

// Quick O(n^2) solution, useful for feeding into the brute force later on
func SolveKfsGreedy(kfs []kungfu.KungFu, memo OverlapMemoTable) []kungfu.KungFu {
	kfGroups := make([][]kungfu.KungFu, len(kfs))
	for i, kf := range kfs {
		kfGroups[i] = []kungfu.KungFu{kf}
	}

	for len(kfGroups) > 1 {
		leftIdx := -1
		rightIdx := -1
		maxLenReduction := -1
		for i, kfG1 := range kfGroups {
			for j, kfG2 := range kfGroups {
				if i != j {
					overlapPt, _ := memo.GetOverlap(kfG1[len(kfG1)-1], kfG2[0])
					lenReduct := kfG1[len(kfG1)-1].Length() + overlapPt
					if lenReduct > maxLenReduction {
						leftIdx = i
						rightIdx = j
						maxLenReduction = lenReduct
					}
				}
			}
		}

		merged := make([]kungfu.KungFu, len(kfGroups[leftIdx])+len(kfGroups[rightIdx]))
		copy(merged[:], kfGroups[leftIdx])
		copy(merged[len(kfGroups[leftIdx]):], kfGroups[rightIdx])

		kfGroups[leftIdx] = merged
		kfGroups[rightIdx] = kfGroups[len(kfGroups)-1]
		kfGroups = kfGroups[:len(kfGroups)-1]
	}
	return kfGroups[0]
}

// I should probably add a greedy implmentation internally as a good seed
// for unusedKfs
func SolveKfs(kfs []kungfu.KungFu, memo OverlapMemoTable) {
	kfLenStore := make([]int, len(kfs))
	lenToBeat := 10000 // If someone is doing this with 10000 meridians, something else has gone catastrophically wrong
	permToBeat := kfs
	changeIdx := 0
	kfPerm := kfs
	runs := 0
	for p := make([]int, len(kfs)); p[0] < len(p); {
		runs = runs + 1
		if runs > 10000000 {
			fmt.Println(p)
			fmt.Println(permToBeat)
			fmt.Println(lenToBeat)
			fmt.Println(kfLenStore)
			runs = 0
		}

		fastQuit := false
		for i := changeIdx; i < len(kfs); i++ {
			if i == 0 {
				kfLenStore[0] = kfPerm[0].Length()
			} else {
				overlapPt, _ := memo.GetOverlap(kfPerm[i-1], kfPerm[i])
				kfLenStore[i] = kfLenStore[i-1] - (kfPerm[i-1].Length() + overlapPt) + kfPerm[i].Length()
			}
			if kfLenStore[i] >= lenToBeat {
				// Try next permutation that's different at index i
				changeIdx = perm.NextPerm(p)
				kfPerm = perm.GetPerm(kfs, p)
				fastQuit = true
				break
			}
		}

		if fastQuit {
			continue
		}

		lenToBeat = kfLenStore[len(kfs)-1]
		permToBeat = kfPerm
		// Try next lexigraphic permutation
		changeIdx = perm.NextPerm(p)
		kfPerm = perm.GetPerm(kfs, p)
	}
	fmt.Println(permToBeat)
}
