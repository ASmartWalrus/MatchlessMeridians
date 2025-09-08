package main

import (
	"encoding/json"
	"fmt"
	kungfu "gowasm/KungFu"
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
		kfMap[key] = kungfu.FromStrings(key, val)
	}

	fmt.Println(kfMap["Freeze Spell"].FindPreOverlap(kfMap["Golden Acupuncture"]))
}
