import { call, put, takeLatest } from "redux-saga/effects";
import { getWeb3, getPayableWeb3 } from "./../utils/getWeb3";
import truffleContract from "truffle-contract";
import AxRaffleContract from "../contracts/AxRaffle.json";
import Notif from "../components/Notif";

function* fetchWeb3(action) {
  try {
    yield put({ type: "PL_JOINING" });

    let web3, account
    if(!action.payload) { // Metamask
      // Get network provider and web3 instance.
      web3 = yield getPayableWeb3();
      // Use web3 to get the user's accounts.
      const accounts = yield call(web3.eth.getAccounts);
      if (accounts && accounts.length > 0) {
        // default to get first account from wallet
        account = accounts[0];
        Notif.success("Connected to " + account, 10)
      }
      else {
        throw new Error('No accounts found inside Metamask wallet or Metamask is not connected')
      }
    } else {
      console.log('getting web3 with private key')
      // payload is the private key user typed in from 'privatekey button' from onPrivateKeyButtonClick() function
      web3 = yield getWeb3(true);
      // create account from key, need to append '0x' to get correct account
      // https://github.com/ethereum/web3.js/issues/1072
      account = web3.eth.accounts.privateKeyToAccount('0x' + action.payload);
      if (account.address) Notif.success("Connected to " + account.address, 10)
    }

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
        account,
        contract: instance
      }
    });

    yield put({ type: "PL_TICKETS_FETCH_REQUESTED" });
  } catch (e) {
    yield put({ type: "PL_JOIN_FAILED", payload: e.message });
    Notif.error(
      `${e.message}`
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
        account: action.payload.account,
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
