import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  name: z.string().min(0).max(50),
  amount: z.number(),
  sender_id: z.number(),
  recipient_id: z.number(),
  type: z.string(),
  date: z.any(),
});

export type Task = z.infer<typeof taskSchema>;

// z.object({
//   username: z.string().min(2).max(50),
//   email: z
//     .string({ required_error: "Please select an email to display." })
//     .email(),
//   mobile: z.boolean(),
//   type: z.enum(["all", "mentions", "none"], {
//     required_error: "You need to select a notification type.",
//   }),
//   duration: z.array(z.number().min(0).max(60)),
// }),
