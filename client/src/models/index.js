import { all, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

const context = require.context("./", false, /\.js$/);
const modules = context
  .keys()
  .filter(item => item !== "./index.js")
  .map(key => context(key));

const validModules = modules
  .filter(model => model.default && model.default.name)
  .map(model => model.default);

export function* rootSaga() {
  const effects = validModules.filter(m => m.saga).map(m => fork(m.saga));
  yield all([...effects]);
}

function generateReducers() {
  const reducers = validModules.filter(m => m.reducer).reduce(function(map, obj) {
    map[obj.name] = obj.reducer;
    return map;
  }, {});
  return reducers;
}

export const rootReducer = combineReducers(generateReducers());
