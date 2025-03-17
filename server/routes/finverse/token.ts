export interface FinverseTokenResponse {
  access_token: string;
  expires_in: number;
  issued_at: string;
  token_type: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client_id = config.finverseClientId;
  const client_secret = config.finverseClientSecret;
  const app_id = config.finverseAppId;
  const storage = useStorage(); // Use Nitro's storage

  console.log(client_id);
  const body = {
    client_id,
    client_secret,
    grant_type: "client_credentials",
  };

  try {
    const response = await $fetch<FinverseTokenResponse>(
      "https://api.prod.finverse.net/auth/customer/token",
      {
        method: "POST",
        headers: {
          "X-Request-Id": "setup_on_developer_portal-1742175722",
          "Content-Type": "application/json",
        },
        body,
        redirect: "follow",
      },
    );
    console.log(response);
    // Store token and expiration in storage
    await storage.setItem("finverse:token", {
      access_token: response.access_token,
      expires_at: Date.now() + response.expires_in * 1000,
    });

    return {
      ...response,
    };
  } catch (exception) {
    console.error(exception);
    throw createError({
      statusCode: 400,
      statusMessage: "ERROR",
    });
  }
});
