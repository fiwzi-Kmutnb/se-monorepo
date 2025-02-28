export interface Response {
  statusCode?: number | undefined;
  message: string;
  data?: null | object;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'WAIT';
  timestamp: string;
}

export interface ResponseIO {
  event: string | null;
  message: string;
  data?: object | null;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'WAIT';
  timestamp?: string;
}
