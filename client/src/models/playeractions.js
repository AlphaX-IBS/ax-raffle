import { call, put, select, take, takeEvery } from "redux-saga/effects";
import {
  buyTickets,
  transferTokens,
  exchangeTokensForTickets
} from "../services/PlayerService";
import ERC20ABI from "human-standard-token-abi";

function* requestTokensTransferApproval(action) {
  try {
    yield put({ type: "PL_TOKENS_APPROVING" });
    const { web3, contract, account, connectType } = yield select(state => ({
      web3: state.player.web3,
      contract: state.player.contract,
      account: state.player.account,
      connectType: state.player.connectType
    }));

    const ticketAmount = action.payload.ticketAmount;
    const cryptoCurrency = action.payload.cryptoCurrency;
    const gas = action.payload.gas;

    const cryptoContract = new web3.eth.Contract(
      ERC20ABI,
      cryptoCurrency.contract
    );
    const fromAddress = account;
    const toAddress = contract.address;

    const promises = transferTokens(
      web3,
      cryptoContract,
      fromAddress,
      toAddress,
      connectType,
      cryptoCurrency,
      ticketAmount,
      gas
    );

    const txHash = yield call(() => promises.promiseOfTxHash);

    yield put({ type: "PL_TOKENS_TXHASH_SAVE", payload: txHash });

    yield call(() => promises.promiseOfTransfer);

    yield put({ type: "PL_TOKENS_TRANSFER_SUCCEEDED" });
  } catch (e) {
    console.error(`Transfering tokens failed: ${e}`);
    yield put({
      type: "PL_TOKENS_TRANSFER_FAILED",
      payload: e.message
    });
  }
}

function* cancelExchange(action) {
  try {
    yield put({
      type: "PL_TOKENS_TRANSFER_FAILED",
      payload: "Player cancelled!"
    });
  } catch (e) {
    console.error(e);
  }
}

function* buyTicketsWithTokens(action) {
  try {
    yield put({ type: "PL_TICKETS_BUYING" });
    const { web3, contract, account, connectType } = yield select(state => ({
      web3: state.player.web3,
      contract: state.player.contract,
      account: state.player.account,
      connectType: state.player.connectType
    }));

    const ticketAmount = action.payload.ticketAmount;
    const cryptoCurrency = action.payload.cryptoCurrency;
    const gas = action.payload.gas;

    yield call(
      exchangeTokensForTickets,
      web3,
      contract,
      account,
      connectType,
      cryptoCurrency,
      ticketAmount,
      gas
    );
    yield put({ type: "PL_TICKETS_BUY_SUCCEEDED" });
  } catch (e) {
    alert(e);
    console.error(e.stack);
  }
}

function* buyTicketsWithEth(action) {
  try {
    yield put({ type: "PL_TICKETS_BUYING" });
    const { web3, contract, account, connectType } = yield select(state => ({
      web3: state.player.web3,
      contract: state.player.contract,
      account: state.player.account,
      connectType: state.player.connectType
    }));

    const ticketAmount = action.payload.ticketAmount;
    const cryptoCurrency = action.payload.cryptoCurrency;
    const gas = action.payload.gas;

    yield call(
      buyTickets,
      web3,
      contract,
      account,
      connectType,
      cryptoCurrency,
      ticketAmount,
      gas
    );

    yield put({ type: "PL_TICKETS_BUY_SUCCEEDED" });
  } catch (e) {
    console.error(e);
    yield put({ type: "PL_TICKETS_BUY_FAILED", payload: e.message });
  }
}

function* requestBuyTickets(action) {
  const nestedAction = action.payload;
  const { type } = nestedAction;

  if (type === "TRANSFER_TOKENS") {
    yield call(requestTokensTransferApproval, nestedAction);
  } else if (type === "EXCHANGE_FOR_TICKETS") {
    yield call(buyTicketsWithTokens, nestedAction);
  } else if (type === "CANCEL_EXCHANGE") {
    yield call(cancelExchange, nestedAction);
  } else {
    yield call(buyTicketsWithEth, nestedAction);
  }
}

function* saga() {
  yield take("PL_JOIN_SUCCEEDED");
  yield put({ type: "PL_READY" });
  yield takeEvery("PL_TICKETS_BUY_REQUESTED", requestBuyTickets);
}

const initialState = {
  status: "init", //[ 'ready', 'buying', 'waiting_approval', 'approved']
  error: false,
  txHash: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "PL_READY":
      return {
        ...state,
        status: "ready"
      };
    case "PL_TICKETS_BUYING":
      return {
        ...state,
        status: "buying"
      };
    case "PL_TICKETS_BUY_SUCCEEDED":
      return {
        ...state,
        status: "ready",
        error: false,
        txHash: null
      };
    case "PL_TOKENS_APPROVING":
      return {
        ...state,
        status: "waiting_approval"
      };
    case "PL_TOKENS_TXHASH_SAVE":
      return {
        ...state,
        txHash: action.payload
      };
    case "PL_TOKENS_TRANSFER_SUCCEEDED":
      return {
        ...state,
        status: "approved",
        error: false
      };
    case "PL_TOKENS_TRANSFER_FAILED":
      return {
        ...state,
        status: "ready",
        error: action.payload,
        txHash: null
      };
    case "PL_TICKETS_BUY_FAILED":
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
  name: "playeractions",
  saga,
  reducer
};
