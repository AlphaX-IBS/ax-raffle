import { call, put, takeLatest, select } from "redux-saga/effects";
import { queryWinners, queryWinnerCount } from "../services/GameService";

export const getWinnersContractState = state => ({
  web3: state.api.web3,
  winners: state.winners,
  contract: state.api.contract
});

function shouldLoadMore(list, max) {
  return list.length < max;
}

export function* fetchWinners(action) {
  try {
    const { pageSize, page } = action.payload;
    const { web3, contract, winners } = yield select(getWinnersContractState);

    const startPageIndex = pageSize * Math.max(0, page - 1);

    const { totalWinners, list } = winners;
    // const start = Math.max(startPageIndex, winners.list.length);
    let limit = 2 * pageSize;
    let start = startPageIndex;

    let resultList = [...list];
    let loadMore = false;
    let maxWinners = totalWinners;

    if (startPageIndex < list.length) {
      let emptyElemIndex = -1;
      for (let i = startPageIndex; i < list.length; i++) {
        if (list[i] === null) {
          emptyElemIndex = i;
          break;
        }
      }
      if (emptyElemIndex > 0) {
        start = emptyElemIndex;
        const response = yield call(queryWinners, web3, contract, start, limit);

        resultList = list.slice(0, start);
        resultList.push(...response.list);
        const lastLoaded = start + response.list.length;
        const offset = list.length - lastLoaded;
        if (offset > 0) {
          resultList.push(...list.slice(lastLoaded));
        }

        // set maxWinners for update later
        maxWinners =
          response.totalWinners > totalWinners
            ? response.totalWinners
            : totalWinners;
      } else {
        start = list.length;
        limit -= list.length - startPageIndex - 1;
        loadMore = shouldLoadMore(list, totalWinners);
      }
    } else {
      loadMore = shouldLoadMore(list, totalWinners);
    }
    if (loadMore) {
      const response = yield call(
        queryWinners,
        web3,
        contract,
        startPageIndex,
        limit
      );

      resultList = list.slice(0);
      const offset = startPageIndex - list.length;
      if (offset > 0) {
        resultList.push(...Array(offset).fill(null));
      }
      resultList.push(...response.list);

      // set maxWinners for update later
      maxWinners =
        response.totalWinners > totalWinners
          ? response.totalWinners
          : totalWinners;
    }

    yield put({
      type: "WINNERS_FETCH_SUCCEEDED",
      payload: {
        list: resultList,
        totalWinners: maxWinners
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
