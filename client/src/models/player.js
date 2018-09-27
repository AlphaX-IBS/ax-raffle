import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import { queryAllPlayerTickets } from "../services/TicketService";

function* fetchPlayerTickets(action) {
  try {
    yield put({ type: "PL_TICKETS_FETCHING" });
    const tickets = yield call(queryAllPlayerTickets);
    yield put({ type: "PL_TICKETS_FETCH_SUCCEEDED", payload: tickets });
  } catch (e) {
    yield put({ type: "PL_TICKETS_FETCH_FAILED", payload: e.message });
  }
}

function* playerSaga() {
  yield takeLatest("PL_TICKETS_FETCH_REQUESTED", fetchPlayerTickets);
}

const initialState = {
  loading: false,
  error: false,
  web3: undefined,
  accounts: [],
  contract: undefined,
  tickets: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "PL_TICKETS_FETCHING":
      return {
        ...state,
        loading: true
      };
    case "PL_TICKETS_FETCH_SUCCEEDED":
      return {
        ...state,
        loading: false,
        error: false,
        tickets: action.payload
      };
    case "PL_TICKETS_FETCH_FAILED":
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default {
  name: "player",
  saga: playerSaga,
  reducer
};
