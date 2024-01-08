export interface ITagPost {
  name: string;
}

export interface ITagGet extends ITagPost {
  id: number;
}

export interface IRecordPost {
  tag_id: number;
  desc: string;
  content: string;
}

export interface IRecordGet extends IRecordPost {
  id: number;
  created: string;
  updated: string;
  tag: ITagGet | null;
}

export interface Notification {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}
