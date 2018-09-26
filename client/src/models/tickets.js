import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import { queryTickets } from "../services/TicketService";

function* fetchTickets(action) {
  try {
    const { pageSize, page } = action.payload;
    const tickets = yield select(state => state.tickets);
    console.log(JSON.stringify(tickets));
    let start = 0;
    let limit = 10;
    const lastIndex = pageSize * page;
    const startIndex = pageSize * Math.max(0, page - 1);
    let response;
    if (tickets.list.length < lastIndex) {
      start = startIndex;
      limit = limit > pageSize ? limit : pageSize;
      response = yield call(queryTickets, start, limit);
    } else {
      response = {
        list: tickets.list,
        totalTicketCount: tickets.totalTicketCount,
        total: tickets.total
      };
    }
    console.log(JSON.stringify(response));
    yield put({
      type: "TICKET_FETCH_SUCCEEDED",
      payload: response
    });
  } catch (e) {
    yield put({ type: "TICKET_FETCH_FAILED", message: e.message });
  }
}

function* ticketSaga() {
  yield takeLatest("TICKET_FETCH_REQUESTED", fetchTickets);
}

const initialState = {
  loading: false,
  error: false,
  list: [],
  totalTicketCount: 0,
  total: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TICKET_FETCH_SUCCEEDED":
      return {
        loading: false,
        error: false,
        list: action.payload.list,
        totalTicketCount: action.payload.totalTicketCount,
        total: action.payload.total
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
