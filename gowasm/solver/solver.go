package solver

import (
	"fmt"
	kungfu "gowasm/kungfu"
)

// Permutation Code from Paul Hankin at SO
// https://stackoverflow.com/a/30230552
func nextPerm(p []int) {
	for i := len(p) - 1; i >= 0; i-- {
		if i == 0 || p[i] < len(p)-i-1 {
			p[i]++
			return
		}
		p[i] = 0
	}
}

func getPerm(kfs *[]kungfu.KungFu, p []int) []kungfu.KungFu {
	result := make([]kungfu.KungFu, len(*kfs))
	copy(result, *kfs)
	for i, v := range p {
		result[i], result[i+v] = result[i+v], result[i]
	}
	return result
}

func SolveKfs(kfs *[]kungfu.KungFu, memo OverlapMemoTable) {
	unusedKfs := []kungfu.KungFu{}
	for _, kf := range *kfs {
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

	for p := make([]int, len(unusedKfs)); p[0] < len(p); nextPerm(p) {
		fmt.Println(getPerm(&unusedKfs, p))
	}
}
