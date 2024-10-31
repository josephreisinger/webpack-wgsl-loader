/// <reference types="@webgpu/types" />
export declare function base64VLQtoNumbers(vlq: string): number[];
export declare function numbersToBase64VLQ(values: number[]): string;
type Line = string;
type SourceName = string;
export declare class Source {
    name: SourceName;
    lines: Array<Source | Line>;
    constructor(name: SourceName, lines: Array<Source | Line>);
}
export interface Mapping {
    generatedColumn: number;
    originalSourceName: string;
    originalLine: number;
    originalColumn: number;
}
export interface SourceMap {
    version: number;
    mappings: Mapping[];
    sources: SourceName[];
    file: string;
}
export interface Program {
    sourceMap: SourceMap;
    code: string;
}
export declare function createSourceMapTree(source: Source, prog: Program): void;
export declare function programToShader(prog: Program): GPUShaderModuleDescriptor;
export {};
