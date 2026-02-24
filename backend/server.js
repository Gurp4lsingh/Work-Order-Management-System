require("dotenv").config();
const app = require("./src/app");

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`WorkOrderHub backend listening on port ${port}`);
});
