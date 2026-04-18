import { enrichFromGitHub } from "@/lib/enrichment/github";
import { enrichFromWebsites } from "@/lib/enrichment/website";

(async () => {
  await enrichFromGitHub();
  await enrichFromWebsites();
  console.log("Enrichment complete");
})();
