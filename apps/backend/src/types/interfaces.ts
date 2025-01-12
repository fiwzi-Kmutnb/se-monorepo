export interface Response {
  statusCode?: number | undefined;
  message: string;
  data?: null | object;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'WAIT';
  timestamp: string;
}
