export type CompilationResult = {
  type: "success";
  payload: {
    result: string;
  };
} | {
  type: "failure";
  payload: {
    message: string;
  };
};

export interface CompilationRequest {
  source: string;
}