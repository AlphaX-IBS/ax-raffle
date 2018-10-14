import { call, cancelled, put, select, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { poll, sleep } from "./../utils/polling";

function pollEvents(web3, contract) {
  return eventChannel(emitter => {
    const timeout = poll(() => {
      // const options = { fromBlock: 0, toBlock: "latest" };
      // const eventObjs = await contract.getPastEvents(
      //   "PurchaseTicketsByWei",
      //   options
      // );

      emitter(true);
    }, 10000);
    // The subscriber must return an unsubscribe function
    return () => {
      clearTimeout(timeout);
    };
  });
}

function getBlockNumberFromEventObj(eventObjs) {
  if (eventObjs && eventObjs.length > 0) {
    return eventObjs[eventObjs.length - 1].blockNumber;
  }
  return null;
}

function* watchSaga() {
  yield take("GLOBAL_FETCH_SUCCEEDED");

  const { web3, contract } = yield select(state => ({
    web3: state.api.web3,
    contract: state.api.contract
  }));

  console.log("getblocknum");

  // const blockFilter = web3.eth.filter({ address: contract.address });
  // let latestBlock = yield call(
  //   web3.eth.getFilterChanges,
  //   blockFilter.filter_id
  // );
  // let currentBlockNumber = latestBlock.blockNumber;

  // let currentBlockNumber = yield call(web3.eth.getBlockNumber);
  // yield put({ type: "SAVE_CURRENT_BLOCKNUM", currentBlockNumber });

  let prevBlkNum = yield call(web3.eth.getBlockNumber);

  console.log("create chan");
  const chan = yield call(pollEvents, web3, contract);
  // let i = 0;
  try {
    while (true) {
      // i++;
      yield take(chan);
      // const blk = yield take(subscription);

      let curBlkNum = yield call(web3.eth.getBlockNumber);

      if (prevBlkNum < curBlkNum) {
        // Fetch events from currentBlockNumber to the latest block.
        // Adding 1 as we do NOT want to get the prev block again.
        const options = { fromBlock: prevBlkNum + 1, toBlock: "latest" };
        const eventObjs = yield call(
          contract.getPastEvents,
          "allEvents",
          options
        );

        const eventMap = {};

        eventObjs.map(elem => {
          const evt = {
            event: elem.event,
            address: elem.address,
            returnValues: elem.returnValues,
            logIndex: elem.logIndex,
            blockNumber: elem.blockNumber,
            topics: elem.raw.topics
          };
          console.log(`EVENT => ${JSON.stringify(evt)}`);

          if (!eventMap[elem.event]) {
            eventMap[elem.event] = [];
          }
          eventMap[elem.event].push(evt);
        });

        if (Object.keys(eventMap).length > 0) {
          yield put({ type: "GLOBAL_FETCH_REQUESTED" });
        }

        const eventNames = Object.keys(eventMap);
        for(let i = 0;i < eventNames.length;i++) {
          const eventName = eventNames[i];
          const eventObjs = eventMap[eventName];
          
          if (
            eventName === "PurchaseTicketsByWei" ||
            eventName === "TokenTransferSuccessful"
          ) {
            yield put({ type: "PL_TICKETS_FETCH_REQUESTED", payload: { events: eventObjs } });
            yield put({ type: "TICKET_FETCH_REQUESTED/EVENTS", payload: { events: eventObjs } })
          } else if (eventName === "DrawTicketSuccessful") {
            yield put({ type: "WINNERS_FETCH_REQUESTED/EVENTS", payload: { events: eventObjs } });
          }
        }
        

        // let curBlkNum = getBlockNumberFromEventObj(eventObjs);
        // if (!curBlkNum) {
        //   latestBlock = yield call(
        //     web3.eth.getFilterChanges,
        //     blockFilter.filter_id
        //   );
        //   curBlkNum = latestBlock.blockNumber;
        yield put({ type: "SAVE_CURRENT_BLOCKNUM", curBlkNum });
      }
      prevBlkNum = curBlkNum;
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
      console.log("countdown cancelled");
    }
  }
}

const initialState = {
  block: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_CURRENT_BLOCKNUM":
      return {
        ...state,
        block: action.payload
      };
    default:
      return state;
  }
};

export default {
  name: "scevents",
  saga: watchSaga,
  reducer
};
