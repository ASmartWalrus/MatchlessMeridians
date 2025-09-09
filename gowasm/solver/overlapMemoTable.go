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

// Seperate Memo + Retrieval due to incomplete memo table issue

// Memo overlaps for all kfs against existing kfs and itself
func (memo OverlapMemoTable) MemoNewOverlaps(kfs *[]kungfu.KungFu) {
	// Extend existing
	for _, newKf := range *kfs {
		// If a KF with existing meridians are already in memo, skip
		if _, ok := memo.overlapMap[newKf.MeridianBits()]; ok {
			continue
		}

		for kfBits, kfOverlaps := range memo.overlapMap {
			kf := kungfu.MakeKungFu("", kfBits)

			kfOverlaps[newKf.MeridianBits()] = kf.FindPreOverlap(newKf)
		}
	}

	// Add overlap maps for new kfs
	for _, newKf := range *kfs {
		if _, ok := memo.overlapMap[newKf.MeridianBits()]; !ok {
			memo.overlapMap[newKf.MeridianBits()] = map[uint64]int{}
		}
	}

	// Fill new empty overlap maps
	for kfBits, kfOverlaps := range memo.overlapMap {
		if len(kfOverlaps) == 0 {
			kf := kungfu.MakeKungFu("", kfBits)
			for otherBits := range memo.overlapMap {
				other := kungfu.MakeKungFu("", otherBits)
				if kfBits != otherBits {
					kfOverlaps[otherBits] = kf.FindPreOverlap(other)
				}
			}
		}
	}
}
