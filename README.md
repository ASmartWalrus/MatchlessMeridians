# The Matchless Kungfu Meridians Solver/Optimizer

This is a tool for solving for an optimal meridian setup for a set of inner KungFus in the game [Matchless KungFu](https://store.steampowered.com/app/1696440/The_Matchless_Kungfu/).

## Usage:
~~Clone this repository and ...~~ Visit https://asmartwalrus.github.io/MatchlessMeridians/. You don't need to read past this section if you just want to find an optimal meridian setup.

## Development and Installation:
Pre-requisites:
```
Rust: 1.89.0
    - wasm-pack: 0.13.1
Node: v20.19.0
```

## Building and Running:

Wasm:
```
cd rustwasm
wasm-pack build --target web
```

Site:
```
cd meridiansite
npm run dev
npm run build
```

## Technical Breakdown:

All the technically relevant code is in rustwasm, this is the actual engine used for solving. This a technical breakdown of the specific techniques used to speed-up solving:
```
WASM on Webworker:
    A simple tool choice which offloads the computation heavy nature of this problem to a seperate thread running WASM. The seperate thread speeds up the computation tremendously, while WASM provides a small boost to computation.

Bit Encoding Acupoint Requirements:
    Since the longest Inner KungFu is less than 32 acupoints and there are only 3 types of acupoints, you can encode every KungFu in 64 bits, with 2 bits per acupoint. This bit representation allows for easier hashing, O(1) comparisons, access to bit operations, and benefits from CPU instruction optimizations that is unavailable to Strings.

Memoizing and Optimizing KungFus Overlaps: 
    Finding overlaps is always O(m) where m is the combined lengths of the KungFus where it is typically O(m^2), Using bits and bit operations to find overlaps cuts out the overhead from string ops and iterating over characters.
    We memo every overlap in the input KungFus which means evaluating Overlaps is O(1) for all future operations, which we do a lot. This takes O(n^2), since m is capped to 32.

Filtering:
    Quick and easy way to reduce the size of n is to filter out KungFus that have acupoint requirements which exist in other KungFus. Small but important for reducing run-time.

Greedy Solution:
    A O(n^3) Greedy Solution is done to quickly find a rough solution used for seeding. The strategy is simple: Choose 2 KungFus which have the greatest overlap in O(n^2), fuse them, repeat it until all n KungFus are fused. This solution is actually really good, usually 3 or 4 acupoints off from an optimal solution.

Brute Force Solution:
    To begin with O(2^n) is the theoretical minimum you could achieve if you managed to evaluate each permutation in O(1) time, my solution is O(n * 2^n) through a lot of magic (Better than DP TSP with better space at O(n^2)).
    From here, we can only go for optimizations via speeding up certain operations:
    - Permutation Iteration: Permutations are generated in lexographic order, very useful for other things.
    - Piece-meal Length Evaluation: Lengths are evaluated piece-by-piece, based on parts of the permutation. This cuts down length evaluation to only evaluating only a few overlaps on average.
    - Permutation Skipping: We can skip over a large number of permutations by skipping to the next permutation in lexographic order which is different at the violating index (where the permutation goes over the existing minimum length).
```

## Similar Projects:
https://github.com/YewYew/The-Matchless-Kungfu-Meridians-Tool

https://github.com/AlienAtSystem/KungfuMeridians
