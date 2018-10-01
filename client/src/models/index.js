import { fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import TicketModel from "./tickets";
import PlayerModel from "./player";
import PlayerTicketsModel from "./playertickets";
import GlobalModel from "./global";
import ApiModel from "./api";
import PlayerActionsModel from "./playeractions";
import PotModel from "./pot";
import WinnersModel from "./winners";

const context = require.context("./", false, /\.js$/);
const all = context
  .keys()
  .filter(item => item !== "./index.js")
  .map(key => context(key));

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
// requires and returns all modules that match

const modules = requireAll(context);

// is an array containing all the matching modules

// function startSagas(...sagas) {
//   return function* rootSaga() {
//     yield sagas.map(saga => fork(saga))
//   }
// }

// // usage
// export default rootSaga = startSagas(saga1, saga2

export function* rootSaga() {
  const l = modules.map(model => model.saga);
  console.log(`All models = ${JSON.stringify(l)}`);
  yield [
    fork(ApiModel.saga),
    fork(TicketModel.saga),
    fork(PlayerModel.saga),
    fork(PlayerTicketsModel.saga),
    fork(GlobalModel.saga),
    fork(PlayerActionsModel.saga),
    fork(PotModel.saga),
    fork(WinnersModel.saga)
  ];
}

export const rootReducer = combineReducers({
  api: ApiModel.reducer,
  tickets: TicketModel.reducer,
  player: PlayerModel.reducer,
  playertickets: PlayerTicketsModel.reducer,
  global: GlobalModel.reducer,
  playeractions: PlayerActionsModel.reducer,
  pot: PotModel.reducer,
  winners: WinnersModel.reducer
});
