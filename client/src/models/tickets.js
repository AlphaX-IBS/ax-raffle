import { call, put, takeLatest, select } from "redux-saga/effects";
import { queryPotRecordsPerPlayer } from "../services/GameService";
import { load } from "../utils/loadhelper";

function* fetchTickets(action) {
  try {
    const { pageSize, page } = action.payload;
    const { tickets, contract, totalPotPlayers } = yield select(state => ({
      tickets: state.tickets,
      contract: state.api.contract,
      totalPotPlayers: state.pot.totalPotPlayers
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
