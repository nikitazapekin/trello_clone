export type BuildPaths = Record<"entry" | "html" | "public" | "output" | "src", string>;

export type BuildMode = "production" | "development";

export interface BuildOptions {
  port: number;
  paths: BuildPaths;
  mode: BuildMode;
  analyzer?: boolean;
}
