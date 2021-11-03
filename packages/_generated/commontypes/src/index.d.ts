export type CompilationResult = {
  type: "SUCCESS";
  payload: {
    result: string;
  };
} | {
  type: "FAILURE";
  payload: {
    message: string;
  };
};

export interface CompilationRequest {
  source: string;
}