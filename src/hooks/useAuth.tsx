import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ENV_CONSTANTS } from "@constants/envConstants";
import { ERROR_CONSTANTS } from "@constants/errors";
import WeatherAppError from "@errors/weatherAppError";
import {
  LocalstorageUtils,
  STORAGE_KEYS,
} from "@utils/helpers/localstorageUtility/localstorageUtility";

import { cleanUpEvents, fetchCalendarEventsRequest } from "@store/actions/googleCalendar";

import type { GoogleTokenResponse } from "./types";

const { SIGN_IN_ERROR, TITLE } = ERROR_CONSTANTS.AUTH_ERRORS;
const useAuth = () => {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState<string | null>(
    LocalstorageUtils.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN)
  );

  useEffect(() => {
    setAccessToken(LocalstorageUtils.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN));
  }, []);

  const handleAuthClick = useCallback(() => {
    if (accessToken !== null) {
      LocalstorageUtils.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      setAccessToken(null);

      return;
    }

    const googleAuth = (window as unknown as { google?: unknown })?.google;

    if (!googleAuth || typeof googleAuth !== "object" || !("accounts" in googleAuth)) {
      return;
    }

    const accounts = (googleAuth as { accounts: unknown }).accounts;

    if (typeof accounts !== "object" || !accounts || !("oauth2" in accounts)) {
      return;
    }

    const oauth2 = (accounts as { oauth2: unknown }).oauth2;

    if (typeof oauth2 !== "object" || !oauth2 || !("initTokenClient" in oauth2)) {
      return;
    }

    const initTokenClient = (oauth2 as { initTokenClient: Function }).initTokenClient;

    const client = initTokenClient({
      client_id: ENV_CONSTANTS.GOOGLE_CLIENT_ID || "",
      scope: ENV_CONSTANTS.GOOGLE_SCOPE || "",
      callback: async (tokenResponse: GoogleTokenResponse) => {
        if (tokenResponse.access_token) {
          LocalstorageUtils.setItem<string>(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.access_token);
          setAccessToken(tokenResponse.access_token);
          try {
            await dispatch(
              fetchCalendarEventsRequest({
                accessToken: tokenResponse.access_token,
              })
            );
          } catch {
            LocalstorageUtils.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            setAccessToken(null);
            throw new WeatherAppError(TITLE, SIGN_IN_ERROR);
          }
        }
      },
    });

    client.requestAccessToken();
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (accessToken !== null) {
      dispatch(fetchCalendarEventsRequest({ accessToken }));
    } else {
      dispatch(cleanUpEvents());
    }
  }, [accessToken, dispatch]);

  return { isSignedIn: accessToken !== null, handleAuthClick };
};

export default useAuth;
