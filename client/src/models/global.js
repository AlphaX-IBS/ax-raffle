import { all, call, put, takeLatest, select, fork } from "redux-saga/effects";
import { queryGameConfigs, queryTotalWinners } from "../services/GameService";

function* fetchGameConfigs() {
  try {
    const { web3, contract } = yield select(state => ({
      web3: state.api.web3,
      contract: state.api.contract
    }));

    const configs = yield call(queryGameConfigs, web3, contract);

    yield put({ type: "GAME_CONFIGS_FETCH_SUCCEEDED", payload: configs });
  } catch (e) {
    yield put({ type: "GLOBAL_FETCH_FAILED", payload: e.message });
  }
}

function* fetchWinners() {
  try {
    const { contract } = yield select(state => ({
      contract: state.api.contract
    }));

    const totalWinners = yield call(queryTotalWinners, contract);
    yield put({ type: "TOTAL_WINNERS_SAVE", payload: totalWinners });
    yield put({
      type: "WINNERS_FETCH_REQUESTED",
      payload: { page: 1, pageSize: 6 }
    });
  } catch (e) {
    console.error("Failed to load total of winners");
  }
}

function* fetchTickets() {
  try {
    yield put({ type: "POT_FETCH_REQUESTED" });
  } catch (e) {
    console.error("Failed to load total of winners");
  }
}

function* fetchAllGlobal() {
  yield fork(fetchGameConfigs);
  yield all([call(fetchTickets), call(fetchWinners)]);
}

function* saga() {
  yield takeLatest("GLOBAL_FETCH_REQUESTED", fetchAllGlobal);
}

const initialState = {
  gameConfigs: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GLOBAL_FETCH_FAILED":
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case "GAME_CONFIGS_FETCH_SUCCEEDED":
      return {
        ...state,
        gameConfigs: action.payload
      };
    default:
      return state;
  }
};

export default {
  name: "global",
  saga,
  reducer
};
