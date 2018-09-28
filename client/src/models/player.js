import { call, put, takeLatest } from "redux-saga/effects";
import { getPayableWeb3 } from "./../utils/getWeb3";
import truffleContract from "truffle-contract";
import AxRaffleContract from "../contracts/AxRaffle.test.json";

function* fetchWeb3() {
  try {
    yield put({ type: "PL_JOINING" });
    // Get network provider and web3 instance.
    const web3 = yield getPayableWeb3();

    // Use web3 to get the user's accounts.
    const accounts = yield call(web3.eth.getAccounts);

    // Get the contract instance.
    const Contract = truffleContract(AxRaffleContract);
    Contract.setProvider(web3.currentProvider);
    const instance = yield call(Contract.deployed);

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    yield put({
      type: "PL_JOIN_SUCCEEDED",
      payload: {
        web3,
        accounts,
        contract: instance
      }
    });

    yield put({ type: "PL_TICKETS_FETCH_REQUESTED" });
  } catch (e) {
    yield put({ type: "PL_JOIN_FAILED", payload: e.message });
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details. ${
        e.message
      }`
    );
  }
}

function* playerSaga() {
  yield takeLatest("PL_JOIN_REQUESTED", fetchWeb3);
}

const initialState = {
  loading: false,
  error: false,
  web3: undefined,
  accounts: [],
  contract: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "PL_JOINING":
      return {
        ...state,
        loading: true
      };
    case "PL_JOIN_SUCCEEDED":
      return {
        ...state,
        loading: false,
        error: false,
        web3: action.payload.web3,
        accounts: action.payload.accounts,
        contract: action.payload.contract
      };
    case "PL_JOIN_FAILED":
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
  name: "player",
  saga: playerSaga,
  reducer
};
