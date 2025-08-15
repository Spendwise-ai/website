import { z } from "zod";

export default z
  .object({

    DATABASE_HOST: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_PASSWORD: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("production"),
  })
  .passthrough()
  .parse(process.env);
