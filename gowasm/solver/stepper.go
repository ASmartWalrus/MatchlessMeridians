package solver

import kungfu "gowasm/kungfu"

/*
type solvedKungfu struct {
	kf        kungfu.KungFu
	idx       int
	mergedKfs []solvedKungfu // Kungfus that fit inside of this one (index is relative to 0)
}

type SolveResults struct {
	kfs         []solvedKungfu
	totalLength int
}
*/

type SolveStepper interface {
	New() string
	Step(kfs *[]kungfu.KungFu, usageVector *[]bool) string
}
