import {
  actionChannel,
  call,
  put,
  select,
  take
} from "redux-saga/effects";
import { buffers } from "redux-saga";
import { queryPotRecordsPerPlayer } from "../services/GameService";
import { load } from "../utils/loadhelper";

function* fetchTickets(action) {
  try {
    const { pageSize, page } = action.payload;
    const { tickets, contract, totalPotPlayers } = yield select(state => ({
      tickets: state.tickets,
      contract: state.api.contract,
      totalPotPlayers: state.global.totalPotPlayers
    }));

    const result = yield call(
      load,
      { list: tickets.list, total: totalPotPlayers },
      { pageSize, page },
      (list, max, start, limit) =>
        queryPotRecordsPerPlayer(contract, start, limit),
      (resultList, max) => resultList
    );

    yield put({
      type: "TICKET_FETCH_SUCCEEDED",
      payload: result
    });
  } catch (e) {
    console.error(JSON.stringify(e.stack));
    yield put({ type: "TICKET_FETCH_FAILED", payload: e.message });
  }
}

function* ticketSaga() {
  // 1- Create a channel for request actions, keep only one request and it is the latest one.
  const requestChan = yield actionChannel(
    "TICKET_FETCH_REQUESTED",
    buffers.sliding(1)
  );
  yield take("GLOBAL_FETCH_SUCCEEDED");

  while (true) {
    // 2- take from the channel
    const action = yield take(requestChan);
    // 3- Note that we're using a blocking call
    yield call(fetchTickets, action);
  }
}

const initialState = {
  status: "init",
  error: false,
  list: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TICKET_FETCH_SUCCEEDED":
      return {
        ...state,
        status: "ready",
        error: false,
        list: action.payload
      };
    case "TICKET_FETCH_FAILED":
      return {
        ...state,
        status: "ready",
        error: action.payload
      };
    default:
      return state;
  }
};

export default {
  name: "tickets",
  saga: ticketSaga,
  reducer
};
