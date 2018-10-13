import { actionChannel, call, put, select, take } from "redux-saga/effects";
import { buffers } from "redux-saga";
import { queryWinners } from "../services/GameService";
import { load } from "../utils/loadhelper";

const getWinnersContractState = state => ({
  web3: state.api.web3,
  winners: state.winners,
  contract: state.api.contract
});

function shouldUpdateCurrentPage(page = 1, pageSize = 6, total = 0, reverse = false) {
  const totalPages = Math.ceil(total / pageSize);
  if(reverse) {
    return page === 1;
  }
  return page === totalPages;
}

function* fetchWinners(action) {
  try {
    const { pageSize, page } = action.payload;
    const { web3, contract, winners } = yield select(getWinnersContractState);

    const result = yield call(
      load,
      { list: winners.list, total: winners.totalWinners },
      { pageSize, page },
      (list, max, start, limit) =>
        queryWinners(web3, contract, start, limit, true),
      (resultList, max) => ({
        list: resultList,
        totalWinners: max
      })
    );

    yield put({
      type: "WINNERS_FETCH_SUCCEEDED",
      payload: {
        list: result.list,
        totalWinners: result.totalWinners,
        page,
        pageSize
      }
    });
  } catch (e) {
    yield put({ type: "WINNERS_FETCH_FAILED", payload: e.message });
  }
}

function* refetchCurrentPage(action) {
  try {
    const { events } = action.payload;

    const { web3, contract, winners } = yield select(getWinnersContractState);
    const { page, pageSize } = winners;

    if (shouldUpdateCurrentPage(page, pageSize, winners.totalWinners, true)) {
      const result = yield call(
        load,
        { list: winners.list, total: winners.totalWinners },
        { pageSize, page },
        (list, max, start, limit) =>
          queryWinners(web3, contract, start, limit, true),
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
    }
  } catch (e) {
    yield put({ type: "WINNERS_FETCH_FAILED", payload: e.message });
  }
}

function* saga() {
  yield take("GLOBAL_FETCH_SUCCEEDED");

  // Take the latest request. Doing this as we only have one view using this data.
  const requestChan = yield actionChannel(
    ["WINNERS_FETCH_REQUESTED", "WINNERS_FETCH_REQUESTED/EVENTS"],
    buffers.sliding(1)
  );

  while (true) {
    const action = yield take(requestChan);
    if (action.type === "WINNERS_FETCH_REQUESTED/EVENTS") {
      yield call(refetchCurrentPage, action);
    } else {
      yield call(fetchWinners, action);
    }
  }
}

const initialState = {
  error: false,
  list: [],
  totalWinners: 0,
  page: 1,
  pageSize: 6
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "WINNERS_FETCH_SUCCEEDED":
      return {
        ...state,
        error: false,
        list: action.payload.list,
        totalWinners: action.payload.totalWinners,
        page: action.payload.page,
        pageSize: action.payload.pageSize
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
