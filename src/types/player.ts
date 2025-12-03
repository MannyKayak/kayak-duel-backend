import { Tap } from "./utils";

export type PlayerState = {
  id: string;
  position: number;
  roomId: string;
  velocity?: number;
  lastTap: Tap;
  lastTapTime?: number;
};
