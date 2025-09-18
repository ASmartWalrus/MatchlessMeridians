

#[derive(Clone)]
pub struct KungFu {
	pub name: String,
	pub acupoint_bits: u64,
	pub length: usize
}

impl KungFu {
    pub fn from_bits(name: String, meridian_bits: u64) -> Self {
        return KungFu{ name : name, acupoint_bits : meridian_bits, length : ((u64::BITS - meridian_bits.leading_zeros() + 1) / 2) as usize}
    }

    pub fn from_strings(name: String, number_string: &String) -> Self {
        let mut meridian_bits : u64 = 0;
        for c in number_string.chars() {
            meridian_bits = (meridian_bits << 2) + ((c as u64) - 48);
        }
        return Self::from_bits(name, meridian_bits);
    }

    pub fn check_overlap(self : &Self, other : &Self, i : i32) -> bool {
        return ((other.acupoint_bits >> ((other.length as i32 - self.length as i32 - i) * 2)) & !(!0u64 << (self.length * 2))) == (self.acupoint_bits & !(!0u64 << ((self.length as i32 + i) * 2)))
    }

    pub fn find_overlap(self : &Self, other : &Self) -> i32 {
        let mut i : i32 = (other.length - self.length) as i32;
        while i > -(self.length as i32) && !self.check_overlap(other, i) {
            i -= 1;
        }
        return i;
    }
}
