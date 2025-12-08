import { Tap } from "./utils";
export type PlayerState = {
    id: string;
    position: number;
    roomId: string;
    velocity: number;
    lastTap: Tap;
    prevTap: Tap;
    lastTapTime?: number;
};
//# sourceMappingURL=player.d.ts.map