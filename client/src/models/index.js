import { fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import TicketModel from "./tickets.js";
import PlayerModel from "./player.js";
import PlayerTicketsModel from "./playertickets.js";

export function* rootSaga() {
  yield [
    fork(TicketModel.saga),
    fork(PlayerModel.saga),
    fork(PlayerTicketsModel.saga)
  ];
}

export const rootReducer = combineReducers({
  tickets: TicketModel.reducer,
  player: PlayerModel.reducer,
  playertickets: PlayerTicketsModel.reducer
});
