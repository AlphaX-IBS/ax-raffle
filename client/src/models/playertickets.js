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

function* saga() {
  yield takeLatest("PL_TICKETS_FETCH_REQUESTED", fetchPlayerTickets);
}

const initialState = {
  loading: false,
  error: false,
  list: [],
  totalPlTickets: 0
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
        list: action.payload.list,
        totalPlTickets: action.payload.totalPlTickets
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
  name: "playertickets",
  saga,
  reducer
};
