<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { taskSchema } from "../data/schema";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { types } from "../data/data";
import AccountSelect from "./AccountSelect.vue";

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
const formSchema = toTypedSchema(taskSchema);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    amount: 10,
    type: "expense",
  },
});
const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const client = useSupabaseClient();
const user = useSupabaseUser();
const onSubmit = handleSubmit(async (values) => {
  const date = values.date.toDate();
  console.log(date);
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
  <Sheet>
    <SheetTrigger as-child>
      <Button class="h-8 px-4 pr-3 lg:px-3">
        Add
        <Icon name="i-radix-icons-plus" class="ml-2 h-4 w-4" />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Add Transaction</SheetTitle>
        <SheetDescription>
          Add the details for the transaction here. Click Create when you're
          done.
        </SheetDescription>
      </SheetHeader>
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
              This is your public display name.
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
                  <Calendar v-bind="componentField" initial-focus />
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
                v-bind="componentField"
                :format-options="{
                  style: 'currency',
                  currency: 'MYR',
                  currencySign: 'accounting',
                }"
                :step="0.01"
                :min="0"
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
                  <SelectValue
                    placeholder="Select the type of this transaction"
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    :key="idx"
                    v-for="(type, idx) in types"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        </FormField>
      </form>

      <SheetFooter>
        <SheetClose as-child>
          <Button type="submit" @click="onSubmit"> Save changes </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
