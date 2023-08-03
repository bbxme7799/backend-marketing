import cron from "node-cron";

export const resetProductSchedule = async () => {
  cron.schedule("*/1 * * * *", async () => {
    //delete operation
    //insert operation
    console.log("query product");
  });
};
