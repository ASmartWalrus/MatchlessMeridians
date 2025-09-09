package main

import (
	"encoding/json"
	kungfu "gowasm/kungfu"
	solver "gowasm/solver"
	"io"
	"os"
)

func main() {
	// Let's first read the `config.json` file
	file, _ := os.Open("../InnerKungFu/BaseGame.json")
	defer file.Close()

	contents, _ := io.ReadAll(file)

	var jsonMap map[string]string
	json.Unmarshal(contents, &jsonMap)

	kfMap := map[string]kungfu.KungFu{}
	for key, val := range jsonMap {
		kfMap[key] = kungfu.MakeKungFuFromStrings(key, val)
	}

	allKfs := make([]kungfu.KungFu, len(kfMap))
	i := 0
	for _, kf := range kfMap {
		allKfs[i] = kf
		i = i + 1
	}

	memoTable := solver.MakeMemo()
	memoTable.MemoNewOverlaps(&allKfs)

	solver.SolveKfs(&allKfs, memoTable)
}
