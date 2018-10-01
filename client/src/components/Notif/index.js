import React from "react";
import "rc-notification/assets/index.css";
import Notification from "rc-notification";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
  faSpinner,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faInfoCircle,
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
  faSpinner,
  faTimes
);

const ICON_TYPES = {
  info: faInfoCircle,
  success: faCheckCircle,
  error: faTimesCircle,
  warning: faExclamationCircle,
  loading: faSpinner
};

let defaultDuration = 3;

let defaultTop = 0;
let messageInstance;
let key = 1;
let prefixCls = "rc-notification";
let transitionName = "move-up";
let getContainer = void 0;
let maxCount = 0;

function getMessageInstance(callback) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }

  Notification.newInstance(
    {
      prefixCls: prefixCls,
      transitionName: transitionName,
      style: { top: defaultTop },
      getContainer: getContainer,
      maxCount: maxCount
    },
    function(instance) {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    }
  );
}
function notice(content, duration = defaultDuration, type, onClose) {
  let iconType = ICON_TYPES[type];
  if (typeof duration === "function") {
    onClose = duration;
    duration = defaultDuration;
  }
  let target = key++;
  let closePromise = new Promise(function(resolve) {
    let callback = function callback() {
      if (typeof onClose === "function") {
        onClose();
      }
      return resolve(true);
    };
    getMessageInstance(function(instance) {
      instance.notice({
        key: target,
        duration: duration,
        style: {},
        content: (
          <div
            className={`${prefixCls}-custom-content${
              type ? ` ${prefixCls}-${type}` : ""
            }`}
          >
            <FontAwesomeIcon icon={iconType} />
            <span>{content}</span>
          </div>
        ),
        onClose: callback
      });
    });
  });
  let result = function result() {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = function(filled, rejected) {
    return closePromise.then(filled, rejected);
  };
  result.promise = closePromise;
  return result;
}

export const api = {
  info: function info(content, duration, onClose) {
    return notice(content, duration, "info", onClose);
  },
  success: function success(content, duration, onClose) {
    return notice(content, duration, "success", onClose);
  },
  error: function error(content, duration, onClose) {
    return notice(content, duration, "error", onClose);
  },
  warning: function warning(content, duration, onClose) {
    return notice(content, duration, "warning", onClose);
  },
  loading: function loading(content, duration, onClose) {
    return notice(content, duration, "loading", onClose);
  },
  config: function config(options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
      messageInstance = null;
    }
  },
  destroy: function destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  }
};

export default api;
