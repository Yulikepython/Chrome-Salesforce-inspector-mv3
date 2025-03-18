//eslint-disable-next-line
"use strict";

// Service Worker for Manifest V3
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Perform cookie operations in the background page, because not all foreground pages have access to the cookie API.
  // Firefox does not support incognito split mode, so we use sender.tab.cookieStoreId to select the right cookie store.
  // Chrome does not support sender.tab.cookieStoreId, which means it is undefined, and we end up using the default cookie store according to incognito split mode.
  if (request.message == "getSfHost") {
    // When on a *.visual.force.com page, the session in the cookie does not have API access,
    // so we read the corresponding session from *.salesforce.com page.
    // The first part of the session cookie is the OrgID,
    // which we use as key to support being logged in to multiple orgs at once.
    // http://salesforce.stackexchange.com/questions/23277/different-session-ids-in-different-contexts
    // There is no straight forward way to unambiguously understand if the user authenticated against salesforce.com or cloudforce.com
    // (and thereby the domain of the relevant cookie) cookie domains are therefore tried in sequence.

    // In Manifest V3, Promise-based API is preferred
    const getCookie = async () => {
      try {
        const cookie = await chrome.cookies.get({url: request.url, name: "sid", storeId: sender.tab.cookieStoreId});
        if (!cookie) {
          sendResponse(null);
          return;
        }

        let [orgId] = cookie.value.split("!");
        const salesforceCookies = await chrome.cookies.getAll({name: "sid", domain: "salesforce.com", secure: true, storeId: sender.tab.cookieStoreId});

        let sessionCookie = salesforceCookies.find(c => c.value.startsWith(orgId + "!"));
        if (sessionCookie) {
          sendResponse(sessionCookie.domain);
        } else {
          const cloudforceCookies = await chrome.cookies.getAll({name: "sid", domain: "cloudforce.com", secure: true, storeId: sender.tab.cookieStoreId});
          sessionCookie = cloudforceCookies.find(c => c.value.startsWith(orgId + "!"));
          if (sessionCookie) {
            sendResponse(sessionCookie.domain);
          } else {
            sendResponse(null);
          }
        }
      } catch (error) {
        console.error("Error in getSfHost:", error);
        sendResponse(null);
      }
    };

    getCookie();
    return true; // Tell Chrome that we want to call sendResponse asynchronously.
  }

  if (request.message == "getSession") {
    const getSession = async () => {
      try {
        const sessionCookie = await chrome.cookies.get({url: "https://" + request.sfHost, name: "sid", storeId: sender.tab.cookieStoreId});
        if (!sessionCookie) {
          sendResponse(null);
          return;
        }
        let session = {key: sessionCookie.value, hostname: sessionCookie.domain};
        sendResponse(session);
      } catch (error) {
        console.error("Error in getSession:", error);
        sendResponse(null);
      }
    };

    getSession();
    return true; // Tell Chrome that we want to call sendResponse asynchronously.
  }

  return false;
});
