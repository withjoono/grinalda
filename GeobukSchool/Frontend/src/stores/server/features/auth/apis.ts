import { springApiClient } from "../../api-client";

interface ISocialLoginReturn {
  accessToken: {
    accessToken: string;
    refreshToken: string;
  };
  message: string | null;
  tokenType: "Bearer";
  status: boolean;
}
export const socialLoginFetch = async ({
  oauthId,
}: {
  oauthId: string;
}): Promise<ISocialLoginReturn> => {
  const res = await springApiClient.post("auth/login/oauth2", {
    oauthId,
  });

  return res.data;
};

export const emailLoginFetch = async ({
  email,
  password,
}: {
  email: string | null;
  password: string | null;
}) => {
  const res = await springApiClient.post("auth/login", {
    email,
    password,
  });

  console.log("emailLoginFetch : res [ ", res, " ] ");

  return res.data;
};

interface ITokenRefetchReturn {
  accessToken: {
    accessToken: string;
    refreshToken: null;
  };
  message: null;
  status: boolean;
  tokenType: null;
}

export const tokenReissueFetch = async (
  refreshToken: string,
): Promise<ITokenRefetchReturn> => {
  const res = await springApiClient.get("auth/reissue", {
    params: {
      refreshToken,
    },
  });

  return res.data;
};
