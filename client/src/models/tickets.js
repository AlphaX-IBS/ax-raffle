import { call, put, takeLatest, select } from "redux-saga/effects";
import { queryPotRecords, queryPotRecordsPerPlayer } from "../services/GameService";

function* fetchTickets(action) {
  try {
    const { pageSize, page } = action.payload;
    const { tickets, contract } = yield select(state => ({
      tickets: state.tickets,
      contract: state.api.contract
    }));
    let start = 0;
    let limit = 10;
    const lastIndex = pageSize * page;
    const startIndex = pageSize * Math.max(0, page - 1);
    let result = tickets.list.slice(0);
    if (tickets.list.length < lastIndex) {
      start = startIndex;
      limit = limit > pageSize ? limit : pageSize;
      const response = yield call(queryPotRecordsPerPlayer, contract, start, limit);
      result.push(...response);
    }
    yield put({
      type: "TICKET_FETCH_SUCCEEDED",
      payload: result
    });
  } catch (e) {
    yield put({ type: "TICKET_FETCH_FAILED", payload: e.message });
  }
}

function* fetchPotRecords(action) {
  try {
    const contract = yield select(state => state.api.contract);

    const potRecords = yield call(queryPotRecords, contract);

    yield put({ type: "TICKET_FETCH_SUCCEEDED", payload: potRecords });
  } catch (e) {
    yield put({ type: "TICKET_FETCH_FAILED", payload: e.message });
  }
}

function* ticketSaga() {
  yield takeLatest("TICKET_FETCH_REQUESTED", fetchTickets);
}

const initialState = {
  loading: false,
  error: false,
  list: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TICKET_FETCH_SUCCEEDED":
      return {
        ...state,
        loading: false,
        error: false,
        list: action.payload
      };
    case "TICKET_FETCH_FAILED":
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
  name: "tickets",
  saga: ticketSaga,
  reducer
};
