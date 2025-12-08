import { PlayerState } from "./player";
export type RoomState = {
    id: string;
    players: {
        [playerId: string]: PlayerState;
    };
};
//# sourceMappingURL=room.d.ts.map