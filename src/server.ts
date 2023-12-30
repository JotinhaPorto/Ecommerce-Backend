import Express from "express";
import cors from "cors";
import auth from "./routes/auth";
import store from "./routes/store";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.listen(80, () => console.log("Server running on port 80"));

app.use("/auth", auth)
app.use(store)