import { call, put, select, takeEvery } from "redux-saga/effects";
import { buyTickets } from "../services/PlayerService";

function* requestBuyTickets(action) {
  try {
    yield put({ type: "PL_TICKETS_BUYING" });
    const { web3, contract, account } = yield select(state => ({
      web3: state.player.web3,
      contract: state.player.contract,
      account: state.player.account
    }));

    const totalCost = action.payload;
    const tickets = yield call(buyTickets, web3, contract, account, totalCost);

    yield put({type: "POT_FETCH_REQUESTED"});

    yield put({ type: "PL_TICKETS_BUY_SUCCEEDED", payload: tickets });
  } catch (e) {
    yield put({ type: "PL_TICKETS_BUY_FAILED", payload: e.message });
  }
}

function* saga() {
  yield takeEvery("PL_TICKETS_BUY_REQUESTED", requestBuyTickets);
}

const initialState = {
  loading: false,
  error: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "PL_TICKETS_BUYING":
      return {
        ...state,
        loading: true
      };
    case "PL_TICKETS_BUY_SUCCEEDED":
      return {
        ...state,
        loading: false,
        error: false
      };
    case "PL_TICKETS_BUY_FAILED":
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
  name: "playeractions",
  saga,
  reducer
};
