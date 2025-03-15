<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const { data: accounts } = await useAsyncData("accounts", async () => {
  const { data } = await client
    .from("entity")
    .select(
      "*",
    )
    .eq('user_id', user.value?.id as string)
  return data
})

const config = useRuntimeConfig()

async function linkFinverse() {
  const body = {
    client_id: config.finverseClientId,
    client_secret: config.finverseClientSecret,
    grant_type: "grant_type",
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      "X-Request-Id": "setup_on_developer_portal-1742007028",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    redirect: 'follow',
  }

  fetch("https://api.prod.finverse.net/auth/customer/token", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))
}
</script>

<template>
  <div class="-m-4 lg:-m-6">
    {{ config.finverseAppId }}
    {{ config.finverseClientId }}
    {{ config.finverseClientSecret }}
    <div v-for="account in accounts">
      {{ account }}
    </div>

    <Button @click="linkFinverse()">
      Add Account
    </Button>
  </div>
</template>
