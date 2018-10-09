import { call, put, takeLatest, select } from "redux-saga/effects";
import { queryGlobalParams } from "../services/GameService";

function* fetchGlobalParams() {
  try {
    yield put({ type: "GLOBAL_FETCHING" });

    const { web3, contract } = yield select(state => ({
      web3: state.api.web3,
      contract: state.api.contract
    }));

    const params = yield call(queryGlobalParams, web3, contract);

    const { lengthOfGameWinners, ...rest } = params;

    yield put({ type: "GLOBAL_FETCH_SUCCEEDED", payload: rest });

    yield put({ type: "TOTAL_WINNERS_SAVE", payload: lengthOfGameWinners });

    yield put({
      type: "WINNERS_FETCH_REQUESTED",
      payload: { page: 1, pageSize: 6 }
    });
  } catch (e) {
    yield put({ type: "GLOBAL_FETCH_FAILED", payload: e.message });
  }
}

function* saga() {
  yield takeLatest("GLOBAL_FETCH_REQUESTED", fetchGlobalParams);
}

function calculateGameStatus(oldValue, payload) {
  const {
    potOpenedTimestamp,
    potClosedTimestamp
  } = payload;
  const now = Date.now();
  let gamestatus = oldValue;
  if (potOpenedTimestamp < now) {
    if (now < potClosedTimestamp) {
      gamestatus = "opening";
    } else {
      gamestatus = "drawing";
    }
  } else {
    gamestatus = "starting";
  }
  return gamestatus;
}

// const gamestatus = [
//   'stopped', 'starting', 'opening', 'drawing'
// ];

const initialState = {
  status: "init",
  gamestatus: "stopped"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GLOBAL_FETCHING":
      return {
        ...state,
        status: "loading"
      };
    case "GLOBAL_FETCH_FAILED":
      return {
        ...state,
        status: "ready",
        error: action.payload
      };
    case "GLOBAL_FETCH_SUCCEEDED":
      const gamestatus = calculateGameStatus(state.gamestatus, action.payload);
      return {
        ...state,
        status: "ready",
        ...action.payload,
        gamestatus
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
