import { actionChannel, call, put, select, take } from "redux-saga/effects";
import { queryPotRecordsPerPlayer } from "../services/GameService";
import { load } from "../utils/loadhelper";

function getPlayerAddressFromEvent(eventObj) {
  if (eventObj.event === "PurchaseTicketsByWei") {
    return eventObj.returnValues.playerAddress;
  }
  if (eventObj.event === "TokenTransferSuccessful") {
    return eventObj.returnValues.from_;
  }
  return null;
}

function shouldUpdateCurrentPage(page = 1, pageSize = 6, list = [], events) {
  const playerAddresses = events.map(eventObj =>
    getPlayerAddressFromEvent(eventObj)
  );

  const updatedIndices = [];
  for (let i = 0; i < playerAddresses.length; i++) {
    const address = playerAddresses[i];
    for (let j = 0; j < list.length; j++) {
      if (list[j].playerAddress === address) {
        updatedIndices.push(j);
      }
    }
  }

  for (let i = 0; i < updatedIndices.length; i++) {
    const index = updatedIndices[i];
    if (Math.ceil(index / pageSize) === page) {
      return true;
    }
  }

  return false;
}

function* fetchTickets(action) {
  try {
    const { pageSize, page } = action.payload;
    const { tickets, contract, totalPotPlayers } = yield select(state => ({
      tickets: state.tickets,
      contract: state.api.contract,
      totalPotPlayers: state.global.totalPotPlayers
    }));

    const result = yield call(
      load,
      { list: tickets.list, total: totalPotPlayers },
      { pageSize, page },
      (list, max, start, limit) =>
        queryPotRecordsPerPlayer(contract, start, limit),
      (resultList, max) => resultList
    );

    yield put({
      type: "TICKET_FETCH_SUCCEEDED",
      payload: {
        list: result,
        page,
        pageSize
      }
    });
  } catch (e) {
    console.error(JSON.stringify(e.stack));
    yield put({ type: "TICKET_FETCH_FAILED", payload: e.message });
  }
}

function* refetchCurrentPage(action) {
  try {
    const { events } = action.payload;

    const { tickets, contract, totalPotPlayers } = yield select(state => ({
      tickets: state.tickets,
      contract: state.api.contract,
      totalPotPlayers: state.global.totalPotPlayers
    }));
    const { page, pageSize } = tickets;

    if (shouldUpdateCurrentPage(page, pageSize, tickets.list, events, false)) {
      const result = yield call(
        load,
        { list: tickets.list, total: totalPotPlayers },
        { pageSize, page },
        (list, max, start, limit) =>
          queryPotRecordsPerPlayer(contract, start, limit),
        (resultList, max) => resultList,
        true
      );

      yield put({
        type: "TICKET_UPDATED_SUCCEEDED",
        payload: result
      });
    }
  } catch (e) {
    yield put({ type: "TICKET_FETCH_FAILED", payload: e.message });
  }
}

function* ticketSaga() {
  // 1- Create a channel for request actions, keep only one request and it is the latest one.
  const requestChan = yield actionChannel([
    "TICKET_FETCH_REQUESTED",
    "TICKET_FETCH_REQUESTED/EVENTS"
  ]);

  yield take("GLOBAL_FETCH_SUCCEEDED");

  while (true) {
    // 2- take from the channel
    const action = yield take(requestChan);
    // 3- Note that we're using a blocking call
    if (action.type === "TICKET_FETCH_REQUESTED/EVENTS") {
      yield call(refetchCurrentPage, action);
    } else {
      yield call(fetchTickets, action);
    }
  }
}

const initialState = {
  status: "init",
  error: false,
  list: [],
  page: 1,
  pageSize: 6
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TICKET_FETCH_SUCCEEDED":
      return {
        ...state,
        status: "ready",
        error: false,
        list: action.payload.list,
        page: action.payload.page,
        pageSize: action.payload.pageSize
      };
    case "TICKET_UPDATED_SUCCEEDED":
      return {
        ...state,
        list: action.payload
      };
    case "TICKET_FETCH_FAILED":
      return {
        ...state,
        status: "ready",
        error: action.payload
      };
    default:
      return state;
  }
};

export default {
  name: "tickets",
  saga: ticketSaga,
  reducer
};
