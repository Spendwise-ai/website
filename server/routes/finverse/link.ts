import { useCookie } from "nuxt/app";

export interface FinverseLinkResponse {
  access_token: string;
  expires_in: number;
  issued_at: string;
  link_url: string;
  token_type: "Bearer";
}
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client_id = config.finverseClientId;
  const storage = useStorage();
  const tokenData = (await storage.getItem("finverse:token")) as {
    access_token: string;
    expires_at: number;
  } | null;

  console.log(tokenData);
  if (!tokenData || tokenData.expires_at <= Date.now()) {
    throw createError({
      statusCode: 401,
      statusMessage: "No valid access token available",
    });
  }

  const token = tokenData.access_token;
  console.log(token);
  const body = {
    client_id,
    user_id: "customer_user1",
    redirect_uri: "http://localhost:3000/finverse/sink",
    state: "setup_on_developer_portal_stateparameter",
    grant_type: "client_credentials",
    response_mode: "form_post",
    response_type: "code",
    automatic_data_refresh: "",
    countries: [],
    // institution_id: "testbank",
    institution_status: "",
    language: "en",
    link_mode: "real test",
    products_requested: [],
    products_supported: [],
    ui_mode: "iframe",
    user_configs: {},
    user_type: [],
  };

  try {
    const response = await $fetch<FinverseLinkResponse>(
      "https://api.prod.finverse.net/link/token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Request-Id": "TEST",
        },
        body,
        redirect: "follow",
        credentials: "include",
      },
    );
    return {
      ...response,
    };
  } catch (exception) {
    console.error(exception);
    throw createError({
      statusCode: 401,
      statusMessage: JSON.stringify(exception),
    });
  }
});
