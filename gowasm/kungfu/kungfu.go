package kungfu

import (
	"fmt"
	"math/bits"
)

type KungFu struct {
	name         string
	meridianBits uint64
	length       int
}

func MakeKungFu(name string, meridianBits uint64) KungFu {
	return KungFu{name, meridianBits, (bits.Len64(meridianBits) + 1) / 2}
}

func MakeKungFuFromStrings(name string, numberString string) KungFu {
	var meridianBits uint64 = 0
	for _, c := range numberString {
		meridianBits = (meridianBits << 2) + (uint64(c) - 48)
	}
	return KungFu{name, meridianBits, (bits.Len64(meridianBits) + 1) / 2}
}

// returns Name
func (kf KungFu) Name() string {
	return kf.name
}

func (kf KungFu) MeridianBits() uint64 {
	return kf.meridianBits
}

// returns Meridians represented with ⭗⟁⧈ similtar to in-game
// TODO: Maybe check if its reasonable to optimize this (it probably shouldn't be called that much anyways)
func (kf KungFu) Meridians() string {
	remainingBits := kf.meridianBits
	builtString := ""
	for remainingBits > 0 {
		switch remainingBits % 4 {
		case 1:
			builtString = "⭗" + builtString
		case 2:
			builtString = "⟁" + builtString
		case 3:
			builtString = "⧈" + builtString
		}

		remainingBits /= 4
	}
	return builtString
}

// returns Number of Meridians
func (kf KungFu) Length() int {
	return kf.length
}

// This is a nightmare to explain, but its attempting to avoid any branching for optimization
// This errors if kf extends past other (as keikaku intended)
func (kf KungFu) checkOverlap(other KungFu, i int) bool {
	return ((other.meridianBits >> ((other.length - kf.length - i) * 2)) & ^(uint64(0xFFFFFFFF) << (kf.length * 2))) == (kf.meridianBits & ^(uint64(0xFFFFFFFF) << ((kf.length + i) * 2)))
}

// Returns at which index does kf has a maximum overlap with other
// Note: Pre-overlap means kf does not extend past end of other
func (kf KungFu) FindPreOverlap(other KungFu) int {
	i := other.length - kf.length
	for ; i > -kf.length && !kf.checkOverlap(other, i); i-- {
	}
	return i
}

// returns string representation
func (kf KungFu) String() string {
	return fmt.Sprintf("%s : %s", kf.name, kf.Meridians())
}
