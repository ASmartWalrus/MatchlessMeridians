use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

use crate::{kungfu::KungFu, solver::Solver};

mod kungfu;
mod permute;
mod solver;

#[wasm_bindgen]
pub fn init_solver(meridian_strs: Vec<String>) -> JsValue {
    let kfs: Vec<KungFu> = meridian_strs.iter().map(|x| KungFu::from(x)).collect();
    serde_wasm_bindgen::to_value(&Solver::new(kfs.as_slice())).unwrap()
}

#[wasm_bindgen]
pub fn step_solver(solver_js: JsValue) -> JsValue {
    let mut solver: Solver = serde_wasm_bindgen::from_value(solver_js).unwrap();
    solver.progress();
    return serde_wasm_bindgen::to_value(&solver).unwrap();
}
