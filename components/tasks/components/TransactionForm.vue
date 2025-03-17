<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { taskSchema } from "../data/schema";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { types } from "../data/data";
import AccountSelect from "./AccountSelect.vue";
import { type Tables } from "~/types/database.types";

interface Emits {
  (e: "submit"): void;
}
interface Props {
  initial?: Tables<"transactions">;
  edit?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  edit: false,
});
const emit = defineEmits<Emits>();

import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
const formSchema = toTypedSchema(taskSchema);

const { isFieldDirty, handleSubmit, setFieldValue, values, setValues } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      amount: -10,
      type: "expense",
    },
  });

onMounted(() => {
  if (props.edit && props.initial) {
    const { date, ...initialValues } = props.initial;
    setValues(initialValues);
  }
});

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const client = useSupabaseClient();
const user = useSupabaseUser();
const onSubmit = handleSubmit(async (values) => {
  emit("submit");
  const date = new Date(values.date);
  console.log("Date", date);
  console.log(props.initial);
  if (props.edit) {
    console.error("EDITING");
    const { data, error } = await client
      .from("transactions")
      .update({ ...values, date })
      .eq("id", props.initial.id);

    if (error) {
      toast("Error Occurred", {
        description: h(
          "pre",
          { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
          h("code", { class: "text-white" }, JSON.stringify(error, null, 2)),
        ),
      });
    } else {
      toast("Added transaction successfully");
    }
  } else {
    const { data, error } = await client
      .from("transactions")
      .insert({ ...values, date });

    if (error) {
      toast("Error Occurred", {
        description: h(
          "pre",
          { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
          h("code", { class: "text-white" }, JSON.stringify(error, null, 2)),
        ),
      });
    } else {
      toast("Added transaction successfully");
    }
  }
});

const { data: accounts } = await useAsyncData("accounts", async () => {
  const { data } = await client
    .from("entity")
    .select("*")
    .eq("user_id", user.value?.id as string);
  return data;
});
</script>
<template>
  <form class="w-full md:w-2/3 space-y-6">
    <FormField
      v-slot="{ componentField }"
      name="name"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Patty at Burger Shack"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          Something that describes this transaction
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField, value }"
      name="date"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Date</FormLabel>
        <FormControl>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !value && 'text-muted-foreground',
                  )
                "
              >
                <Icon name="i-lucide-calendar" class="mr-2 h-4 w-4" />
                {{
                  value
                    ? df.format(value.toDate(getLocalTimeZone()))
                    : "Pick a date"
                }}
              </Button>
            </PopoverTrigger>

            <PopoverContent class="w-auto p-0">
              <Calendar v-bind="componentField" />
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="sender_id">
      <FormItem>
        <FormLabel>Sender</FormLabel>

        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select the sending account" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="account in accounts" :value="account.id">
                <div class="flex items-center gap-1.5">
                  <img
                    :src="`/bank-logo/${account.provider}.png`"
                    class="w-5"
                  />
                  {{ account.name }}
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormDescription>
          You can add accounts in the
          <a href="/accounts">accounts</a> page.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField, value }" name="recipient_id">
      <FormItem>
        <FormLabel>Recipient</FormLabel>
        <AccountSelect v-bind="componentField" />

        <FormDescription>
          You can add recipient entities as you need
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField, value }" name="amount">
      <FormItem>
        <FormLabel>Amount</FormLabel>
        <FormControl>
          <NumberField
            id="balance"
            :model-value="value"
            :format-options="{
              style: 'currency',
              currency: 'MYR',
              currencySign: 'accounting',
              signDisplay: 'exceptZero',
            }"
            :step="0.01"
            @update:model-value="
              (v) => {
                if (v) {
                  setFieldValue('amount', v);
                  setFieldValue('type', v > 0 ? 'income' : 'expense');
                } else {
                  setFieldValue('amount', undefined);
                }
              }
            "
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="type">
      <FormItem>
        <FormLabel>Type</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select the type of this transaction" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                :key="idx"
                v-for="(type, idx) in types"
                :value="type.value"
                class=""
              >
                <div class="flex items-center gap-1.5">
                  <component :is="type.icon" class="opacity-60" />
                  <span>
                    {{ type.label }}
                  </span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" @click="onSubmit" class="w-full">
      Save changes
    </Button>
  </form>
</template>
