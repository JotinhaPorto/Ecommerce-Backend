import 'express-async-errors'
import Express from "express";
import cors from "cors";
import auth from "./routes/auth";
import store from "./routes/store";
import { errorMiddleware } from "./middleware/error";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));


app.use("/auth", auth)
app.use(store)


app.use(errorMiddleware)

app.listen(process.env.PORT ?? 80, () => console.log("Server running"));