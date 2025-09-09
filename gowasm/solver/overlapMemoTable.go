package solver

import (
	kungfu "gowasm/kungfu"
)

// Class for storing and calculating overlaps (This optimizes across multiple runs and allows for pre-calculation + pre-pack of overlaps)
type OverlapMemoTable struct {
	overlapMap map[uint64]map[uint64]int
}

func MakeMemo() OverlapMemoTable {
	return OverlapMemoTable{map[uint64]map[uint64]int{}}
}

func (memo OverlapMemoTable) OverlapMap() map[uint64]map[uint64]int {
	return memo.overlapMap
}

func (memo OverlapMemoTable) GetOverlap(kf kungfu.KungFu, otherKf kungfu.KungFu) (int, bool) {
	v, ok := memo.overlapMap[kf.MeridianBits()][otherKf.MeridianBits()]
	return v, ok
}

func (memo OverlapMemoTable) GetOrFindOverlap(kf kungfu.KungFu, otherKf kungfu.KungFu) int {
	if overlap, ok := memo.GetOverlap(kf, otherKf); ok {
		return overlap
	}

	if _, ok := memo.overlapMap[kf.MeridianBits()]; !ok {
		memo.overlapMap[kf.MeridianBits()] = map[uint64]int{}
	}
	overlap := kf.FindPreOverlap(otherKf)
	memo.overlapMap[kf.MeridianBits()][otherKf.MeridianBits()] = overlap
	return overlap
}

// Memo overlaps for all kfs against existing kfs and itself
func (memo OverlapMemoTable) MemoNewOverlaps(kfs *[]kungfu.KungFu) {
	// Extend existing
	for kfBits, kfOverlaps := range memo.overlapMap {
		kf := kungfu.MakeKungFu("", kfBits)
		for _, newKf := range *kfs {
			kfOverlaps[newKf.MeridianBits()] = kf.FindPreOverlap(newKf)
		}
	}

	// Add overlaps for new kfs
	for _, kf := range *kfs {
		memo.overlapMap[kf.MeridianBits()] = map[uint64]int{}
	}
	for kfBits, kfOverlaps := range memo.overlapMap {
		kf := kungfu.MakeKungFu("", kfBits)
		for otherBits := range memo.overlapMap {
			if kfBits != otherBits {
				other := kungfu.MakeKungFu("", otherBits)
				kfOverlaps[otherBits] = kf.FindPreOverlap(other)
			}
		}
	}
}
