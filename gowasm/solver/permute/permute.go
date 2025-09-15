package permute

// Lexigraphic Permutation Code adapted from Paul Hankin at SO
// https://stackoverflow.com/a/30230552
// Returns left-most change
func NextPerm(p []int) int {
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
func NextPermDiffAtIdx(p []int, idx int) int {
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

func GetPerm[T any](kfs []T, p []int) []T {
	result := make([]T, len(kfs))
	copy(result, kfs)
	for i, v := range p {
		result[i], result[i+v] = result[i+v], result[i]
	}
	return result
}
