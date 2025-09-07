// Source from KernelSU (https://github.com/tiann/KernelSU)
function exec(command, options = {}) {
  return new Promise((resolve, reject) => {
    const callback = "__paigisk_cb_" + Date.now();

    window[callback] = (errno, stdout, stderr) => {
      delete window[callback];
      resolve({ errno, stdout, stderr });
    };

    try {
      if (options && Object.keys(options).length > 0) {
        window.paigisk.exec(command, JSON.stringify(options), callback);
      } else {
        window.paigisk.exec(command, callback);
      }
    } catch (e) {
      reject(e);
    }
  });
}

function spawn(command, args = [], options = {}) {
  const callback = "__paigisk_spawn_" + Date.now();

  const listeners = {
    stdout: [],
    stderr: [],
    exit: [],
    error: []
  };

  const cp = {
    stdout: {
      on: (event, cb) => {
        if (event === "data") listeners.stdout.push(cb);
      }
    },
    stderr: {
      on: (event, cb) => {
        if (event === "data") listeners.stderr.push(cb);
      }
    },
    on: (event, cb) => {
      if (listeners[event]) listeners[event].push(cb);
    }
  };

  window[callback] = {
    stdout: {
      emit: (ev, data) => {
        if (ev === "data") listeners.stdout.forEach(fn => fn(data));
      }
    },
    stderr: {
      emit: (ev, data) => {
        if (ev === "data") listeners.stderr.forEach(fn => fn(data));
      }
    },
    emit: (ev, data) => {
      if (listeners[ev]) listeners[ev].forEach(fn => fn(data));
    }
  };

  try {
    window.paigisk.spawn(command, JSON.stringify(args), JSON.stringify(options), callback);
  } catch (e) {
    listeners.error.forEach(fn => fn(e));
  }

  return cp;
}

function fullScreen(enable) {
  try {
    window.paigisk.fullScreen(enable);
  } catch (e) {
    console.error("fullScreen error:", e);
  }
}

function toast(msg) {
  try {
    window.paigisk.toast(msg);
  } catch (e) {
    console.error("toast error:", e);
  }
}

function moduleInfo() {
  try {
    return JSON.parse(window.paigisk.moduleInfo());
  } catch (e) {
    console.error("moduleInfo error:", e);
    return {};
  }
}

export { exec, spawn, fullScreen, toast, moduleInfo };