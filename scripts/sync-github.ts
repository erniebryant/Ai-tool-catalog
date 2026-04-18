import { enrichFromGitHub } from "@/lib/enrichment/github";

enrichFromGitHub().then(() => console.log("GitHub sync complete"));
