import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils/slug";

const categories = ["AI Agents","Agent Frameworks","Developer Tools","Coding Assistants","LLM Apps","LLM Infrastructure","RAG Tools","Vector Databases","Prompt Engineering","Workflow Automation","Image Generation","Video Generation","Audio / Voice","Search / Research","Data Analysis","Productivity","Marketing / Sales","Customer Support","Security","Enterprise AI","Local AI / On-Device AI","Model Serving","Evaluation / Observability","Fine-Tuning / Training","Robotics / Embodied AI","Education","Healthcare","Legal","Finance","Defense / Government","Other"];

async function main() {
  for (const name of categories) {
    await prisma.category.upsert({ where: { slug: toSlug(name) }, create: { name, slug: toSlug(name) }, update: {} });
  }

  const tool = await prisma.tool.upsert({
    where: { slug: "langchain" },
    create: {
      name: "LangChain",
      slug: "langchain",
      shortDescription: "Framework for building LLM-powered applications.",
      websiteUrl: "https://www.langchain.com/",
      githubUrl: "https://github.com/langchain-ai/langchain",
      githubOwner: "langchain-ai",
      githubRepoName: "langchain",
      businessModel: "open_source",
      status: "active",
      sourceReferenceCount: 2,
      distinctSourceCount: 2,
      githubStars: 1
    },
    update: {}
  });

  const cat = await prisma.category.findUnique({ where: { slug: "agent-frameworks" } });
  if (cat) await prisma.toolCategory.upsert({ where: { toolId_categoryId: { toolId: tool.id, categoryId: cat.id } }, create: { toolId: tool.id, categoryId: cat.id, isPrimary: true }, update: {} });

  console.log("Seed complete");
}

main().finally(async () => prisma.$disconnect());
