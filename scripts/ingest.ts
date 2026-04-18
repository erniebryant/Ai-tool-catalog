import { runIngestion } from "@/lib/ingestion/pipeline";

runIngestion().then(() => {
  console.log("Ingestion complete");
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
