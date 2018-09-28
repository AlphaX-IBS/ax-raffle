import { call, put, takeLatest, select } from "redux-saga/effects";
import { queryWinners } from "../services/GameService";

function* fetchWinners(action) {
  try {
    const { pageSize, page } = action.payload;
    const { web3, contract, winners } = yield select(state => ({
      web3: state.api.web3,
      winners: state.winners,
      contract: state.api.contract
    }));
    let start = 0;
    let limit = 10;
    const lastIndex = pageSize * page;
    const startIndex = pageSize * Math.max(0, page - 1);
    let result = {
      list: winners.list.slice(0),
      totalWinners: winners.totalWinners
    };
    if (winners.list.length < lastIndex) {
      start = startIndex;
      limit = limit > pageSize ? limit : pageSize;
      const response = yield call(queryWinners, web3, contract, start, limit);
      result.list.push(...response.list);
      result.totalWinners = response.totalWinners;
    }
    yield put({
      type: "WINNERS_FETCH_SUCCEEDED",
      payload: result
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
