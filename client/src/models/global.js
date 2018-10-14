import { call, put, takeLatest, select, fork } from "redux-saga/effects";
import {
  queryGlobalParams,
  querySupportedTokens,
  queryPotTokenAmounts,
  calculatePotPrize
} from "../services/GameService";

function* fetchGlobalParams() {
  try {
    yield put({ type: "GLOBAL_FETCHING" });

    const { web3, contract } = yield select(state => ({
      web3: state.api.web3,
      contract: state.api.contract
    }));

    const params = yield call(queryGlobalParams, web3, contract);

    const { lengthOfGameWinners, ...rest } = params;

    yield put({ type: "TOTAL_WINNERS_SAVE", payload: lengthOfGameWinners });
    yield put({ type: "GLOBAL_FETCH_SUCCEEDED", payload: rest });
  } catch (e) {
    yield put({ type: "GLOBAL_FETCH_FAILED", payload: e.message });
  }

  yield fork(fetchSupportedTokens);
}

function* fetchSupportedTokens() {
  const { web3, contract, ticketPrice, totalEthPot } = yield select(state => ({
    web3: state.api.web3,
    contract: state.api.contract,
    ticketPrice: state.global.ticketPrice,
    totalEthPot: state.global.totalEthPot
  }));

  const tokens = yield call(querySupportedTokens, web3, contract);

  yield put({ type: "SAVE_SUPPORTED_TOKENS", payload: tokens });

  const potTokens = yield call(queryPotTokenAmounts, web3, contract);

  // Calculate total pot amount
  const result = yield call(calculatePotPrize, tokens, potTokens, ticketPrice, totalEthPot);

  yield put({
    type: "SAVE_POT_TOKENS",
    payload: result.potTokens
  });

  yield put({
    type: "SAVE_POT_AMOUNT",
    payload: result.totalPot.toString()
  });
}

function* saga() {
  yield takeLatest("GLOBAL_FETCH_REQUESTED", fetchGlobalParams);
}

function calculateGameStatus(oldValue, payload) {
  const { potOpenedTimestamp, potClosedTimestamp } = payload;
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
  gamestatus: "stopped",
  totalPot: 0,
  supportedTokens: {},
  potTokens: {}
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
    case "SAVE_SUPPORTED_TOKENS":
      return {
        ...state,
        supportedTokens: action.payload
      };
    case "SAVE_POT_TOKENS":
      return {
        ...state,
        potTokens: action.payload
      };
    case "SAVE_POT_AMOUNT":
      return {
        ...state,
        totalPot: action.payload
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
