import { call, put, select, takeLatest } from "redux-saga/effects";
import { queryAllPlayerTickets } from "../services/PlayerService";
import { queryPotPlayer } from "../services/GameService";

function* fetchPlayerTickets() {
  try {
    yield put({ type: "PL_TICKETS_FETCHING" });
    const { web3, contract, account } = yield select(state => ({
      web3: state.player.web3,
      contract: state.player.contract,
      account: state.player.account,
      
    }));

    if (!contract) {
      return;
    }

    const tickets = yield call(queryAllPlayerTickets, web3, contract, account);
    tickets.list = tickets.list.reverse();

    const record = yield call(queryPotPlayer, contract, account);

    yield put({ type: "PL_TICKETS_FETCH_SUCCEEDED", payload: {
      plUsedTokens: record.usedTokens,
      list: tickets.list,
      totalPlTickets: tickets.totalPlTickets
    } });
  } catch (e) {
    yield put({ type: "PL_TICKETS_FETCH_FAILED", payload: e.message });
    console.error(e.stack);
  }
}

function* saga() {
  yield takeLatest("PL_TICKETS_FETCH_REQUESTED", fetchPlayerTickets);
}

const initialState = {
  loading: false,
  error: false,
  list: [],
  totalPlTickets: null,
  plUsedTokens: []
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
        totalPlTickets: action.payload.totalPlTickets,
        plUsedTokens: action.payload.plUsedTokens
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
