export interface Linemessage {
  events: {
    type: string;
    message?: {
      type: string;
      id: string;
      text: string;
    };
    source: {
      type: string;
      userId: string;
    };
    replyToken: string;
  }[];
}

export interface Extractmessage {
  message: string;
  type: string;
}

export interface Sendmessage {
  userID: string;
  message: string;
}

export interface Profile {
  displayName: string;
  userId: string;
  pictureUrl: string;
}

export interface orderlist
  extends Array<{
    menu: string;
    quantity: number;
    detail: string | null;
  }> {}
