
export interface Response<T> {
    statusCode?: number | undefined;
    message: string;
    data: T | null;
    type: "SUCCESS" | "ERROR" |"WARNING" | "WAIT";
    timestamp: string;
  }