export enum MessageSendingType {
  TEXT,
  IMAGE,
  TYPING,
  STOP_TYPING,
  AUDIO,
  VIDEO,
}

export enum MessageDeliveryType {
  pending = 0,
  delivered = 1,
  seen = 2,
}
export enum MessageStatusType {
  none = 0,
  update = 1,
  delete = 2,
}

export enum UserType {
  Agent = 0,
  User = 1,
}