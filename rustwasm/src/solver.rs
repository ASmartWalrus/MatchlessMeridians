use std::{collections::HashMap, usize, vec};
use serde::{Deserialize, Serialize};

use crate::kungfu::KungFu;
use crate::permute::{get_perm, next_perm, next_perm_at_idx};

type OverlapMemo = HashMap<u64, HashMap<u64, i32>>;

#[derive(Serialize, Deserialize)]
enum SolveStage {
    Init,
    Memoed,
    Filtered,
    BruteSolving,
    Finished,
}

// Locations correspond with the original kf list
#[derive(Clone)]
#[derive(Serialize, Deserialize)]
pub struct Solution {
    pub mstring : String,
    pub locations : Vec<usize>,
}

// TODO: Some consideration should be made to
impl Solution {
    pub fn build_soln(kfs : &Vec<KungFu>, solution_kf_idxs : &Vec<usize>, memo : &OverlapMemo) -> Solution {
        // This is stupid, but ya know, never gonna end up with a meridian string at usize::MAX
        let mut solution = Solution { mstring : String::new(), locations : vec![usize::MAX; kfs.len()]};

        // Build meridian string and note location of component KFs
        let mut prev_kf_idx : usize = 0;
        for (i, kf_idx) in solution_kf_idxs.iter().enumerate() {
            if i == 0 {
                solution.mstring = kfs[*kf_idx].into();
                solution.locations[*kf_idx] = 0;
            } else {
                let unoverlap_idx = (kfs[prev_kf_idx].length as i32 + memo[&kfs[prev_kf_idx].acupoint_bits][&kfs[*kf_idx].acupoint_bits]) as usize;
                solution.mstring.push_str(&Into::<String>::into(kfs[*kf_idx])[unoverlap_idx..] );
                solution.locations[*kf_idx] = solution.mstring.len() - kfs[*kf_idx].length as usize;
            }
            prev_kf_idx = *kf_idx;
        }

        // Find locations of merged KFs (Kfs not in solution_kf_idxs)
        for (kf_idx, kf_loc) in solution.locations.clone().iter().enumerate() {
            if *kf_loc == usize::MAX {
                let mut overlap_pt = -1;
                // Find earliest point we can merge
                for other_idx in solution_kf_idxs.iter() {
                    overlap_pt = memo[&kfs[kf_idx].acupoint_bits][&kfs[*other_idx].acupoint_bits];
                    if overlap_pt >= 0 {
                        // Mark where in the mstring we can merge
                        solution.locations[kf_idx] = solution.locations[*other_idx] + overlap_pt as usize;
                        break;
                    }
                }
                // Mark merge
                if overlap_pt >= 0 {
                    continue;
                }
            }
        }

        solution
    }
}

// Create a Solver instance that will work through each solution stage
// usize has to be used due to deserialization and serialization of refs being impossible
// Note I could possibly swap the indices with &KungFu to make it easier to use
// and shove a translation layer to convert that to indices inside of serialization
// pain in the butt though
#[derive(Serialize, Deserialize)]
pub struct Solver {
    pub kfs : Vec<KungFu>,
    stage : SolveStage,

    // Cache: Stage
    memo : OverlapMemo,

    // Stage: Filtered
    pub filtered_kf_idxs : Vec<usize>,

    // Stage: Greedy Solved
    pub greedy_kf_idxs : Vec<usize>,
    pub greedy_solution : Solution,

    // Stage: Brute Solving
    pub min_perm_idxs : Vec<usize>,
    pub min_solution : Solution,
    p : Vec<usize>,
    p_lens : Vec<u32>,
}

impl Solver {
    pub fn new(kfs : &[KungFu]) -> Self {
        Solver {
            kfs : kfs.iter().map(|x| x.clone()).collect(),
            memo : OverlapMemo::new(),
            stage : SolveStage::Init,

            filtered_kf_idxs : Vec::new(),

            greedy_kf_idxs : Vec::new(),
            greedy_solution : Solution { mstring : String::new(), locations : Vec::new()},

            min_perm_idxs : Vec::new(),
            min_solution : Solution { mstring : String::new(), locations : Vec::new()},
            p : Vec::new(),
            p_lens : Vec::new(),
        }
    }

    fn memo_overlaps(&mut self) {
        for kf in self.kfs.iter() {
            if let None = self.memo.get(&kf.acupoint_bits) {
                self.memo.insert(kf.acupoint_bits, HashMap::new());
                let kf_map = self.memo.get_mut(&kf.acupoint_bits).unwrap();
            
                for other_kf in self.kfs.iter() {
                    if kf.acupoint_bits != other_kf.acupoint_bits && kf_map.get(&other_kf.acupoint_bits).is_none() {
                        kf_map.insert(other_kf.acupoint_bits, kf.find_overlap(&other_kf));
                    }
                }
            }
        }
        self.stage = SolveStage::Memoed;
    }

    fn filter_mergables(&mut self) {
        self.filtered_kf_idxs = (0..self.kfs.len()).collect();

        // Dedup with shared acupoint requirements
        self.filtered_kf_idxs.dedup_by_key(|v| self.kfs[*v].acupoint_bits);

        // check against every existing acupoints signature
        // Filter out both blanks and mergables
        self.filtered_kf_idxs = self.filtered_kf_idxs.iter().filter_map(|i| -> Option<usize> {
            if self.kfs[*i].acupoint_bits == 0 {
                return None;
            }
            if self.memo.get(&self.kfs[*i].acupoint_bits).and_then(|kf_map| kf_map.iter().find(|(_, v)| **v >= 0)).is_none() { Some(*i) } else { None }
        }).collect();
    
        self.stage = SolveStage::Filtered;
    }

    fn greedy_solve(&mut self) {
        if self.filtered_kf_idxs.len() == 0 {
            self.greedy_solution = Solution { mstring : String::new(), locations : vec![0, self.kfs.len()] };
            self.min_solution = self.greedy_solution.clone();
            self.greedy_kf_idxs = Vec::new();
            self.min_perm_idxs = Vec::new();
            self.stage = SolveStage::BruteSolving;
            return;
        }

        let mut kf_groups : Vec::<Vec<usize>> = self.filtered_kf_idxs.iter().map(|i| vec![*i]).collect();

        while kf_groups.len() > 1 {
            let mut left_idx = 0;
            let mut right_idx = 0;
            let mut max_len_reduct = -1;
            for (i, kfg_1) in kf_groups.iter().enumerate() {
                let kf_1 = &self.kfs[*kfg_1.last().unwrap()];
                for (j, kfg_2) in kf_groups.iter().enumerate() {
                    if i != j {
                        let kf_2 = &self.kfs[kfg_2[0]];
                        let len_reduct = kf_1.length as i32 + self.memo[&kf_1.acupoint_bits][&kf_2.acupoint_bits];
                        if len_reduct > max_len_reduct {
                            left_idx = i;
                            right_idx = j;
                            max_len_reduct = len_reduct;
                        }
                    }
                }
            }

            let mut temp = kf_groups.remove(right_idx);
            kf_groups[left_idx - (right_idx < left_idx) as usize].append(&mut temp);
        }

        self.greedy_kf_idxs = kf_groups.remove(0);
        self.greedy_solution = Solution::build_soln(&self.kfs, &self.greedy_kf_idxs, &self.memo);

        self.min_perm_idxs = self.greedy_kf_idxs.clone();
        self.min_solution = self.greedy_solution.clone();

        self.p.resize(self.min_perm_idxs.len(), 0);
        self.p_lens.resize(self.min_perm_idxs.len(), 0);

        self.stage = SolveStage::BruteSolving;
    }

    fn brute_solve(&mut self) {
        if self.min_solution.mstring.len() == 0 {
            self.stage = SolveStage::Finished;
            return;
        }

        // Need telemetry to determine if copying KungFu is better here than refs
        // Assuming it is due to memory locality of stack
        let seed_kfs : Vec<KungFu> = self.greedy_kf_idxs.iter().map(|i| self.kfs[*i]).collect();
        let max_runs : u32 = 300000; // This should be adjusted so that it takes same time as Greedy
        let mut runs = 0u32;

        let mut p_chg_idx : usize = 0;

        while self.p[0] < self.greedy_kf_idxs.len() && runs < max_runs{
            let mut kf_perm = seed_kfs.clone();
            get_perm::<KungFu>(kf_perm.as_mut_slice(), &self.p);

            let mut fast_quit = false;
            for i in p_chg_idx..kf_perm.len() {
                if i == 0 {
                    self.p_lens[0] = kf_perm[0].length;
                } else {
                    let overlap = self.memo[&kf_perm[i - 1].acupoint_bits][&kf_perm[i].acupoint_bits];
                    self.p_lens[i] = self.p_lens[i-1] - (kf_perm[i-1].length as i32 + overlap) as u32 + kf_perm[i].length;
                }
                if self.p_lens[i] >= self.min_solution.mstring.len() as u32 {
                    // Try next permutation that's different at index i
                    p_chg_idx = next_perm_at_idx(&mut self.p, i);
                    fast_quit = true;
                    runs += 1;
                    break;
                }
            }

            if fast_quit {
                continue;
            }

            // Update min solution
            self.min_perm_idxs = self.greedy_kf_idxs.clone();
            get_perm::<usize>(self.min_perm_idxs.as_mut_slice(), &self.p);
            self.min_solution = Solution::build_soln(&self.kfs, &self.min_perm_idxs, &self.memo);

            // Try next lexigraphic permutation
            p_chg_idx = next_perm(&mut self.p);
            runs += 1;
        }

        if self.p[0] >= self.greedy_kf_idxs.len() {
            self.stage = SolveStage::Finished;
        }
    }

    // Until I figure out a better method, this will do for a prototype
    // TODO: Fix arbitrary step weights
    pub fn progress(&mut self) {
        match self.stage {
            SolveStage::Init => self.memo_overlaps(),
            SolveStage::Memoed => self.filter_mergables(),
            SolveStage::Filtered => self.greedy_solve(),
            SolveStage::BruteSolving => self.brute_solve(),
            SolveStage::Finished => {}
        }
    }
}
