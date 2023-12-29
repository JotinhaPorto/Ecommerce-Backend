import Express from "express";
import cors from "cors";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
  
app.listen(80, () => console.log("Server running on port 80"));

