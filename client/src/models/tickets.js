import { call, put, takeLatest, select } from "redux-saga/effects";
import { queryPotRecords } from "../services/GameService";

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
    let response;
    if (tickets.list.length < lastIndex) {
      start = startIndex;
      limit = limit > pageSize ? limit : pageSize;
      response = yield call(queryPotRecords, contract, start, limit);
    } else {
      response = tickets.list;
    }
    yield put({
      type: "TICKET_FETCH_SUCCEEDED",
      payload: response
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
