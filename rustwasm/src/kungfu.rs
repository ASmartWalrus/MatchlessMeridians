use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
#[derive(Clone, Copy)]
#[derive(Serialize, Deserialize)]
pub struct KungFu {
	pub acupoint_bits: u64,
	pub length: u32
}

impl KungFu {
    pub fn check_overlap(self : &Self, other : &Self, i : i32) -> bool {
        return ((other.acupoint_bits >> ((other.length as i32 - self.length as i32 - i) * 2)) & !(!0u64 << (self.length * 2))) == (self.acupoint_bits & !(!0u64 << ((self.length as i32 + i) * 2)))
    }

    pub fn find_overlap(self : &Self, other : &Self) -> i32 {
        let mut i : i32 = other.length as i32 - self.length as i32;
        while i > -(self.length as i32) && !self.check_overlap(other, i) {
            i -= 1;
        }
        return i;
    }
}

impl From<u64> for KungFu {
    fn from(meridian_bits: u64) -> Self {
        KungFu{ acupoint_bits : meridian_bits, length : ((u64::BITS - meridian_bits.leading_zeros() + 1) / 2) as u32}
    }
}

impl From<&String> for KungFu {
    fn from(number_string: &String) -> Self {
        let mut acupoint_bits : u64 = 0;
        for c in number_string.chars() {
            acupoint_bits = (acupoint_bits << 2) + ((c as u64) - 48);
        }
        return KungFu::from(acupoint_bits);
    }
}

impl Into<String> for &KungFu {
    fn into(self) -> String {
        let mut mstring = String::with_capacity(self.length as usize);
        let mut acubits = self.acupoint_bits;
        while acubits > 0 {
            mstring.push((acubits % 4 + 48) as u8 as char);
            acubits = acubits >> 2;
        }
        return mstring.chars().rev().collect();
    }
}