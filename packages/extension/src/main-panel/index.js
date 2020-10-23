//
// Copyright 2020 DXOS.org
//

/* global chrome */

import { initDevTool } from '@dxos/devtools';

import BridgeProxy from './bridge';

const injected = false;

initDevTool({
  connect (onConnect) {
    const bridge = new BridgeProxy();
    onConnect(bridge);

    if (!injected) {
      bridge.injectClientScript();
    }
  },

  tabId: chrome.devtools.inspectedWindow.tabId,

  onReload (reloadFn) {
    chrome.devtools.network.onNavigated.addListener(reloadFn);
  }
});
