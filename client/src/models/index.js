import { fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import TicketModel from "./tickets.js";

export function* rootSaga() {
  yield [fork(TicketModel.saga)];
}

export const rootReducer = combineReducers({ tickets: TicketModel.reducer });
