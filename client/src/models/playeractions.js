import { call, put, select, takeEvery } from "redux-saga/effects";
import { buyTickets, transferTokens, exchangeTokensForTickets } from "../services/PlayerService";
import ERC20ABI from "human-standard-token-abi";

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

    const cryptoContract = new web3.eth.Contract(
      ERC20ABI,
      cryptoCurrency.contract
    );
    const fromAddress = account;
    const toAddress = contract.address;
    // const cryptoContract = yield call(Contract.deployed);
    const txHash = yield call(
      transferTokens,
      web3,
      cryptoContract,
      fromAddress,
      toAddress,
      connectType,
      cryptoCurrency,
      ticketAmount,
      gas
    );
    yield put({ type: "PL_TOKENS_TRANSFER_SUCCEEDED", payload: txHash });
  } catch (e) {
    console.error(e);
  }
}

function* requestTicketsFromTransferedTokens(action) {
  try {
    yield put({ type: "PL_TICKETS_BUYING" });
    const { web3, contract, account } = yield select(state => ({
      web3: state.player.web3,
      contract: state.player.contract,
      account: state.player.account
    }));

    const ticketAmount = action.payload.ticketAmount;
    const cryptoCurrency = action.payload.cryptoCurrency;
    const gas = action.payload.gas;

    yield call(
      exchangeTokensForTickets,
      web3,
      contract,
      account,
      cryptoCurrency,
      ticketAmount,
      gas
    );
    yield put({ type: "PL_TICKETS_BUY_SUCCEEDED"});
  } catch (e) {
    console.error(e);
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
  const innerAct = action.payload;
  const { type } = innerAct;

  if (type === "TRANSFER_TOKENS") {
    yield call(buyTicketsWithTokens, innerAct);
  } else if (type === "EXCHANGE_FOR_TICKETS") {
    yield call(requestTicketsFromTransferedTokens, innerAct);
  } else {
    yield call(buyTicketsWithEth, innerAct);
  }
}

function* saga() {
  yield takeEvery("PL_TICKETS_BUY_REQUESTED", requestBuyTickets);
}

const initialState = {
  loading: false,
  error: false,
  txHash: null
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
        error: false,
        txHash: null
      };
    case "PL_TOKENS_TRANSFER_SUCCEEDED":
      return {
        ...state,
        loading: false,
        error: false,
        txHash: action.payload
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
