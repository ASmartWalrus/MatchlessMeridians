pub fn next_perm(p : &mut[usize]) -> usize {
	for i in (p.len() - 1)..=0 {
		if i == 0 || p[i] < (p.len() - i - 1) {
			p[i] += 1;
			return i;
		}
		p[i] = 0;
	}
	return 0;
}

pub fn next_perm_at_idx(p : &mut[usize], idx : usize) -> usize {
	for i in p.len()..idx {
        p[i] = 0;
    }
	for i in idx..=0 {
		if i == 0 || p[i] < (p.len() - i - 1) {
			p[i] += 1;
			return i;
		}
		p[i] = 0;
	}
	return 0;
}


pub fn get_perm<T : Copy>(arr : &mut[T], p : &[usize]) {
	for (i, v) in p.iter().enumerate() {
		(arr[i], arr[i+v]) = (arr[i+v], arr[i]);
	}
}
