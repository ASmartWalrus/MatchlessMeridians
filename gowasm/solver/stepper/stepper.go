package stepper

import (
	kungfu "gowasm/kungfu"
)

type SolutionKungfu struct {
	Kf        kungfu.KungFu
	Idx       int
	MergedKfs []SolutionKungfu // Kungfus that fit inside of this one (index is relative to 0)
}

type SolveStep struct {
	UnusedKfs      []SolutionKungfu
	SolutionKfs    []SolutionKungfu
	SolutionLength int
}

// Steppers are meant to be initialized and just run through to get to the end-state
type SolveStepper interface {
	SetState(step SolveStep)
	Step() (SolveStep, bool)
}

func MakeInitialStep(kfs []kungfu.KungFu) SolveStep {
	unusedKfs := make([]SolutionKungfu, len(kfs))
	for i, kf := range kfs {
		unusedKfs[i] = SolutionKungfu{kf, 0, []SolutionKungfu{}}
	}
	return SolveStep{unusedKfs, []SolutionKungfu{}, 0}
}
