/* tslint:disable */
/* eslint-disable */
export function init_solver(meridian_strs: string[]): any;
export function step_solver(solver_js: any): any;
export class KungFu {
  private constructor();
  free(): void;
  acupoint_bits: bigint;
  length: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly init_solver: (a: number, b: number) => any;
  readonly step_solver: (a: any) => any;
  readonly __wbg_kungfu_free: (a: number, b: number) => void;
  readonly __wbg_get_kungfu_acupoint_bits: (a: number) => bigint;
  readonly __wbg_set_kungfu_acupoint_bits: (a: number, b: bigint) => void;
  readonly __wbg_get_kungfu_length: (a: number) => number;
  readonly __wbg_set_kungfu_length: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
