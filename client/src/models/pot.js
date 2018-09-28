import { call, put, takeLatest, select, fork } from "redux-saga/effects";
import { queryPot } from "../services/GameService";

function* fetchPot() {
  try {
    const { web3, contract } = yield select(state => ({
      web3: state.api.web3,
      contract: state.api.contract
    }));

    const pot = yield call(queryPot, web3, contract);

    yield put({ type: "POT_FETCH_SUCCEEDED", payload: pot });
  } catch (e) {
    yield put({ type: "GLOBAL_FETCH_FAILED", payload: e.message });
  }
}

function* saga() {
  yield takeLatest("POT_FETCH_REQUESTED", fetchPot);
}

const initialState = {
  totalTickets: 0,
  totalPotPlayers: 0
};

const reducer = (state = initialState, action) => {
  console.log(`action=${JSON.stringify(action.type)}`);
  switch (action.type) {
    case "POT_FETCH_FAILED":
      return {
        ...state,
        error: action.payload
      };
    case "POT_FETCH_SUCCEEDED":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default {
  name: "pot",
  saga,
  reducer
};
