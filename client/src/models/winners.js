import { call, put, takeLatest, select } from "redux-saga/effects";
import { queryWinners, queryWinnerCount } from "../services/GameService";
import { load } from "../utils/loadhelper";

export const getWinnersContractState = state => ({
  web3: state.api.web3,
  winners: state.winners,
  contract: state.api.contract
});

export function* fetchWinners(action) {
  try {
    const { pageSize, page } = action.payload;
    const { web3, contract, winners } = yield select(getWinnersContractState);

    const result = yield call(
      load,
      { list: winners.list, total: winners.totalWinners },
      { pageSize, page },
      (list, max, start, limit) => queryWinners(web3, contract, start, limit),
      (resultList, max) => ({
        list: resultList,
        totalWinners: max
      })
    );

    yield put({
      type: "WINNERS_FETCH_SUCCEEDED",
      payload: {
        list: result.list,
        totalWinners: result.totalWinners
      }
    });
  } catch (e) {
    yield put({ type: "WINNERS_FETCH_FAILED", payload: e.message });
  }
}

function* saga() {
  yield takeLatest("WINNERS_FETCH_REQUESTED", fetchWinners);
}

const initialState = {
  error: false,
  list: [],
  totalWinners: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "WINNERS_FETCH_SUCCEEDED":
      return {
        ...state,
        error: false,
        list: action.payload.list,
        totalWinners: action.payload.totalWinners
      };
    case "TOTAL_WINNERS_SAVE":
      return {
        ...state,
        error: false,
        totalWinners: action.payload
      };
    case "WINNERS_FETCH_FAILED":
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export default {
  name: "winners",
  saga,
  reducer
};
