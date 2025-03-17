<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();
const { data: accounts } = await useAsyncData("accounts", async () => {
  const { data } = await client
    .from("entity")
    .select("*")
    .eq("user_id", user.value?.id as string);
  return data;
});

const url = ref();

const link = async () => {
  const { data: tokenRequestData, error: tokenRequestError } = await useFetch(
    "/finverse/token",
    {
      pick: ["access_token"],
    },
  );
  console.log(tokenRequestData.value?.access_token);
  const { data: linkRequestData, error: linkRequestError } = await useFetch(
    "/finverse/link",
    {
      pick: ["link_url"],
    },
  );
  console.log(linkRequestData.value?.link_url);
  url.value = linkRequestData.value?.link_url;
};

// add a listener so we get the message sent by the iframe
const receiveMessage = (message: any) => {
  if (message.data === "close") {
    // do whatever is required to close the iframe. The linking did not succeeded due to user pressing the close button.
    url.value = false;
  }
  if (message.data === "success") {
    // do whatever is required to close the iframe
    url.value = false;
    // Since the linking was successful display the next screen
  }
};

onMounted(() => {
  window.addEventListener("message", receiveMessage, false);
});
</script>

<template>
  <div class="-m-4 lg:-m-6">
    <div v-for="account in accounts">
      {{ account }}
    </div>

    <FinverseLinkInstitutionDialog :url="url" />

    <Button @click="link"> Add Account </Button>
  </div>
</template>
