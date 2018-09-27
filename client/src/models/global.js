import { call, put, take, takeLatest, select, fork } from "redux-saga/effects";
import {
  queryGameConfigs,
  queryWinners,
  queryPot,
  queryPotPlayers
} from "../services/GameService";

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
    const contract = yield select(state => state.api.contract);
    const winners = yield call(queryWinners, contract);
    yield put({ type: "WINNERS_FETCH_SUCCEEDED", payload: winners });
  } catch (e) {
    yield put({ type: "GLOBAL_FETCH_FAILED", payload: e.message });
  }
}

function* fetchPotPlayers() {
  try {
    const contract = yield select(state => state.api.contract);
    const potPlayers = yield call(queryPotPlayers, contract);
    yield put({ type: "POT_PLAYERS_FETCH_SUCCEEDED", payload: potPlayers });
  } catch (e) {
    yield put({ type: "GLOBAL_FETCH_FAILED", payload: e.message });
  }
}

function* fetchPot() {
  try {
    const contract = yield select(state => state.api.contract);
    const pot = yield call(queryPot, contract);
    yield put({ type: "POT_FETCH_SUCCEEDED", payload: pot });
  } catch (e) {
    yield put({ type: "GLOBAL_FETCH_FAILED", payload: e.message });
  }
}

function* fetchAllGlobal() {
  console.log("ttt");
  yield [
    fork(fetchGameConfigs),
    fork(fetchWinners),
    fork(fetchPotPlayers),
    fork(fetchPot)
  ];
}

function* saga() {
  yield takeLatest("GLOBAL_FETCH_REQUESTED", fetchAllGlobal);
}

const initialState = {
  gameConfigs: {},
  pot: {},
  potPlayers: [],
  winners: []
};

const reducer = (state = initialState, action) => {
  console.log(`action=${JSON.stringify(action.type)}`);
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
    case "WINNERS_FETCH_SUCCEEDED":
      return {
        ...state,
        winners: action.payload
      };
    case "POT_FETCH_SUCCEEDED":
      return {
        ...state,
        pot: action.payload
      };
    case "POT_PLAYERS_FETCH_SUCCEEDED":
      return {
        ...state,
        potPlayers: action.payload
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
