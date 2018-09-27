import { fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import TicketModel from "./tickets.js";
import PlayerModel from "./player.js";
import PlayerTicketsModel from "./playertickets.js";
import GlobalModel from "./global";
import ApiModel from "./api";

const context = require.context("./", false, /\.js$/);
const all = context
  .keys()
  .filter(item => item !== "./index.js")
  .map(key => context(key));

console.log(JSON.stringify(all));

// function startSagas(...sagas) {
//   return function* rootSaga() {
//     yield sagas.map(saga => fork(saga))
//   }
// }

// // usage
// export default rootSaga = startSagas(saga1, saga2

export function* rootSaga() {
  yield [
    fork(ApiModel.saga),
    fork(TicketModel.saga),
    fork(PlayerModel.saga),
    fork(PlayerTicketsModel.saga),
    fork(GlobalModel.saga)
  ];
}

export const rootReducer = combineReducers({
  api: ApiModel.reducer,
  tickets: TicketModel.reducer,
  player: PlayerModel.reducer,
  playertickets: PlayerTicketsModel.reducer,
  global: GlobalModel.reducer
});
