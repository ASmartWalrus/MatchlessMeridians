use std::{collections::HashMap, usize, vec};
use crate::kungfu::KungFu;
use crate::permute::{self, get_perm, next_perm, next_perm_at_idx};

type OverlapMemo = HashMap<u64, HashMap<u64, i32>>;

enum SolveStage {
    Init,
    OverlapMemoed,
    Filtered,
    BruteSolving,
    Finished,
}

// Create a Solver instance that will work through each solution stage
// An adapted ver. of this is probably going to be passed in and out from WASI
// No references types allowed because it needs to cross WASI barrier
 pub struct Solver {
    pub kfs : Vec<KungFu>,
    stage : SolveStage,

    // Cache: Stage
    pub memo : OverlapMemo,

    // Stage: Filtered
    pub filtered_kfs : Vec<usize>,

    // Stage: Greedy Solved
    pub greedy_kfs : Vec<usize>,
    pub greedy_len : usize,

    // Stage: Brute Solving
    pub min_perm : Vec<usize>,
    pub min_len : usize,
    pub p : Vec<usize>,
    pub p_lens : Vec<usize>,
}

impl Solver {
    pub fn new(kfs : &[KungFu]) -> Self {
        Solver {
            kfs : kfs.iter().map(|x| x.clone()).collect(),
            memo : OverlapMemo::new(),
            stage : SolveStage::Init,

            filtered_kfs : Vec::new(),

            greedy_kfs : Vec::new(),
            greedy_len : 0,

            min_perm : Vec::new(),
            min_len : 0,
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
        
        self.stage = SolveStage::OverlapMemoed;
    }

    fn filter_mergables(&mut self) {
        self.filtered_kfs = (0..self.kfs.len()).collect();

        // Deduplicate first, merge doesn't dedup due to it checking against diff acupoint bits and dupes have same acupoint bits
        self.filtered_kfs.dedup_by_key(|v| self.kfs[*v].acupoint_bits);

        // check against every existing acupoints signature
        self.filtered_kfs = self.filtered_kfs.iter().filter(|i| -> bool {
            self.memo.get(&self.kfs[**i].acupoint_bits).and_then(|kf_map| kf_map.iter().find(|(_, v)| **v >= 0)).is_none()
        }).map(|v| *v).collect();
    
        self.stage = SolveStage::Filtered;
    }

    fn greedy_solve(&mut self) {
        let mut kf_groups : Vec::<Vec<usize>> = (0..self.filtered_kfs.len()).map(|i| vec![i]).collect();

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
            kf_groups[left_idx].append(&mut temp);
        }

        self.min_len = 0;
        self.greedy_kfs = kf_groups.remove(0);
        self.stage = SolveStage::BruteSolving;
    }

    fn brute_solve(&mut self) {
        const MAX_RUNS : u32 = 1000000;
        let mut runs = 0u32;

        let mut p_chg_idx : usize = 0;

        // Move init somewhere else maybe
        if self.min_perm.len() == 0 {
            self.min_perm = self.greedy_kfs.clone();
            self.p.resize(self.greedy_kfs.len(), 0);
            self.p_lens.resize(self.min_perm.len(), 0);
        }

        while self.p[0] < self.kfs.len() && runs <= MAX_RUNS{
            let mut kf_perm = self.greedy_kfs.clone();
            get_perm::<usize>(kf_perm.as_mut_slice(), &self.p);

            let mut fast_quit = false;
            for i in p_chg_idx..kf_perm.len() {
                if i == 0 {
                    self.p_lens[0] = self.kfs[kf_perm[0]].length;
                } else {
                    let overlap = self.memo[&self.kfs[kf_perm[i - 1]].acupoint_bits][&self.kfs[kf_perm[i]].acupoint_bits];
                    self.p_lens[i] = self.p_lens[i-1] - (self.kfs[kf_perm[i-1]].length as i32 + overlap) as usize + self.kfs[kf_perm[i]].length;
                }
                if self.p_lens[i] >= self.min_len {
                    // Try next permutation that's different at index i
                    p_chg_idx = next_perm_at_idx(&mut self.p, i);
                    fast_quit = true;
                    runs += 1;
                    break
                }
            }

            if fast_quit {
                continue;
            }

            self.min_perm = kf_perm;
            self.min_len = *self.p_lens.last().unwrap();
            // Try next lexigraphic permutation
            p_chg_idx = next_perm(&mut self.p);
            runs += 1;

            if self.p[0] >= self.kfs.len() {
                self.stage = SolveStage::Finished;
            }
        }
    }

    // Until I figure out a better method, this will do for a prototype
    // TODO: Fix arbitrary step weights
    pub fn progress(&mut self, steps : usize) {
        for _ in 0..steps {
            match self.stage {
                SolveStage::Init => self.memo_overlaps(),
                SolveStage::OverlapMemoed => self.filter_mergables(),
                SolveStage::Filtered => self.greedy_solve(),
                SolveStage::BruteSolving => self.brute_solve(),
                SolveStage::Finished => {}
            }
        }
    }
}
