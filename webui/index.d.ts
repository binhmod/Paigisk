// Source from KernelSU (https://github.com/tiann/KernelSU)
export interface ExecOptions {
  cwd?: string;
  env?: Record<string, string>;
}

export interface ExecResult {
  errno: number;
  stdout: string;
  stderr: string;
}

export function exec(command: string, options?: ExecOptions): Promise<ExecResult>;

export interface SpawnOptions {
  cwd?: string;
  env?: Record<string, string>;
}

export interface ChildProcess {
  stdout: {
    on(event: "data", cb: (data: string) => void): void;
  };
  stderr: {
    on(event: "data", cb: (data: string) => void): void;
  };
  on(event: "exit", cb: (code: number) => void): void;
  on(event: "error", cb: (err: Error) => void): void;
}

export function spawn(command: string, args?: string[], options?: SpawnOptions): ChildProcess;

export function fullScreen(enable: boolean): void;

export function toast(msg: string): void;

export function moduleInfo(): any;