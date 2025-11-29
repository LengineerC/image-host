import express from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./log/logger.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write(msg) {
        logger.info(msg.trim());
      },
    },
  }),
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("listening...");
});
