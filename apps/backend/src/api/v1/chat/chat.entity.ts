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

export interface orderformat {
  id: number;
  cusID: string;
  menu: orderlist;
  quantity: number;
  totalprice: number;
  address: string;
  phone: string;
  status: string;
  createAt: Date;
}

interface Proxy {
  type: string | null;
  value: string | null;
}

interface Account {
  type: string;
  value: string;
}

interface Person {
  displayName: string;
  name: string | null;
  proxy: Proxy;
  account: Account;
}

interface Data {
  language: string | null;
  transRef: string;
  sendingBank: string;
  receivingBank: string;
  transDate: string;
  transTime: string;
  sender: Person;
  receiver: Person;
  amount: number;
  paidLocalAmount: number | null;
  paidLocalCurrency: string | null;
  countryCode: string;
  transFeeAmount: number | null;
  ref1: string;
  ref2: string;
  ref3: string;
  toMerchantId: string;
}

interface Quota {
  cost: number;
  usage: number;
  limit: number;
}

interface Subscription {
  id: number;
  postpaid: boolean;
}

export interface payment {
  discriminator: string;
  valid: boolean;
  data: Data;
  quota: Quota;
  subscription: Subscription;
  isCached: boolean;
}
