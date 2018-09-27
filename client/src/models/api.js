import { call, put, take, takeLatest, select, fork } from "redux-saga/effects";
import getWeb3 from "./../utils/getWeb3";
import truffleContract from "truffle-contract";
import AxRaffleContract from "../contracts/AxRaffle.test.json";
import {
  queryGameConfigs,
  queryWinners,
  queryPot,
  queryPotPlayers
} from "../services/GameService";

function* fetchWeb3() {
  try {
    yield put({ type: "WEB3_FETCHING" });
    // Get network provider and web3 instance.
    const web3 = yield getWeb3(true);

    // Use web3 to get the user's accounts.
    const accounts = yield call(web3.eth.getAccounts);

    // Get the contract instance.
    const Contract = truffleContract(AxRaffleContract);
    Contract.setProvider(web3.currentProvider);
    const instance = yield call(Contract.deployed);

    // const prizeWei = yield instance.totalWeiPot.call();
    // const prize = web3.utils.fromWei(prizeWei, "ether");
    // console.log(`prize=${prize}`);

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    yield put({
      type: "WEB3_FETCH_SUCCEEDED",
      payload: {
        web3,
        accounts,
        contract: instance
      }
    });

    yield put({ type: "GLOBAL_FETCH_REQUESTED" });
  } catch (e) {
    yield put({ type: "WEB3_FETCH_FAILED", payload: e.message });
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details. ${
        e.message
      }`
    );
  }
}


function* saga() {
    yield takeLatest("WEB3_FETCH_REQUESTED", fetchWeb3);
}

const initialState = {
  loading: false,
  error: false,
  web3: undefined,
  accounts: [],
  contract: undefined
};

const reducer = (state = initialState, action) => {
  console.log(`action=${JSON.stringify(action.type)}`);
  switch (action.type) {
    case "WEB3_FETCHING":
      return {
        ...state,
        loading: true
      };
    case "WEB3_FETCH_SUCCEEDED":
      return {
        ...state,
        loading: false,
        error: false,
        web3: action.payload.web3,
        accounts: action.payload.accounts,
        contract: action.payload.contract
      };
    case "WEB3_FETCH_FAILED":
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
  name: "api",
  saga,
  reducer
};
