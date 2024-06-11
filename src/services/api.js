// import { LogError } from "../utils/Logger";
import log from "loglevel";
import { config } from "../config";
const playerState = require("../utils/PlayerState").PlayerState;

let retryCount = 10;
if (config?.API_RETRY_COUNT) {
  retryCount = Number(config.API_RETRY_COUNT);
}

async function internetJsonFetch(
  method,
  url,
  payload,
  headerOverrides = null,
  settingsOverrides = null
) {
  let tries = 0;

  let headers = {
    "Content-Type": "application/json",
    ...headerOverrides,
  };

  let settings = {
    method: method,
    headers: headers,
    ...settingsOverrides,
  };

  if (payload) {
    settings.body = JSON.stringify(payload);
    log.debug(`URL: ${url} payload: ${settings.body})`);
  }

  while (tries++ < retryCount) {
    try {
      settings.signal = AbortSignal.timeout(30000);
      const response = await fetch(url, settings);

      let data = {};

      if (settings.responseType === "blob") {
        data.body = response.body;
        data.error_code = 200;
      } else {
        data = await response.json();
      }

      if (data.error_code === 401) {
        log.error(`URL '${url}': access denied ${JSON.stringify(data)}`);
        return data;
      }

      if (data.error_code === 500) {
        log.error(`URL '${url}': server error ${JSON.stringify(data)}`);
        return data;
      }

      if (data.error_code !== 200) {
        log.error(
          `URL '${url}': ${JSON.stringify(data)}. try ${tries} of ${retryCount}`
        );
      } else {
        return data;
      }
    } catch (error) {
      log.error(
        `URL '${url}': ${error.message}. try ${tries} of ${retryCount}`
      );
    }
  }

  log.error(`URL '${url}': max retries ${retryCount} exceeded`);

  return {
    data: "max retries exceeded",
    errorCode: 500,
    message: `${URL}: server error`,
  };
}

async function loginUserAsync(credentials) {
  var payload = {
    UserName: credentials.username,
    Password: credentials.password,
  };
  let url = `${config.API_URL}/auth/login`;

  return await internetJsonFetch("POST", url, payload);
}

async function getMap(props, mapId) {
  let url = `${config.API_URL}/maps/${mapId}/shortstatus`;
  let token = props.authActions.getToken();

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  if (data.error_code !== 200) {
    throw new Error(`Error retrieving map ${mapId}: ${data.data}`);
  }

  return data;
}

async function getMaps(props) {
  let url = `${config.API_URL}/maps`;
  let token = props.authActions.getToken();

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  if (data.error_code !== 200) {
    throw new Error(`Error retrieving maps`);
  }

  return data;
}

async function getMapNode(props, mapId, nodeId, dynamicObjects) {
  let token = props.authActions.getToken();
  let url = `${config.API_URL}/maps/${mapId}/node/${nodeId}`;
  let contextId = playerState.GetContextId();

  const data = await internetJsonFetch("POST", url, dynamicObjects, {
    OLabSessionId: contextId,
    Authorization: `Bearer ${token}`,
  });

  if (data.error_code !== 200) {
    throw new Error(`Error retrieving map node: ${mapId}/${nodeId}`);
  }

  return data;
}

async function getNodeScopedObjects(props, nodeId) {
  let token = props.authActions.getToken();
  let url = `${config.API_URL}/nodes/${nodeId}/scopedObjects`;

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  if (data.error_code !== 200) {
    throw new Error(`Error retrieving map node scoped: ${nodeId}`);
  }

  return data;
}

async function getServerScopedObjects(props, serverId) {
  let token = props.authActions.getToken();
  let url = `${config.API_URL}/servers/${serverId}/scopedObjects`;

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  if (data.error_code !== 200) {
    throw new Error(`Error retrieving server scoped: ${serverId}`);
  }

  return data;
}

async function getMapScopedObjects(props, mapId) {
  let url = `${config.API_URL}/maps/${mapId}/scopedObjects`;
  let token = props.authActions.getToken();

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getGroups(props) {
  let url = `${config.API_URL}/groups`;
  let token = props.authActions.getToken();

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getRoles(props) {
  let url = `${config.API_URL}/roles`;
  let token = props.authActions.getToken();

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getUsers(props) {
  let url = `${config.API_URL}/groups`;
  let token = props.authActions.getToken();

  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

export {
  getGroups,
  getMap,
  getMapNode,
  getMaps,
  getMapScopedObjects,
  getNodeScopedObjects,
  getRoles,
  getServerScopedObjects,
  getUsers,
  loginUserAsync,
};
