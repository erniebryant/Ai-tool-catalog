import { prisma } from "@/lib/db";

export async function enrichFromWebsites() {
  const tools = await prisma.tool.findMany({ where: { websiteUrl: { not: null } }, take: 100 });
  for (const tool of tools) {
    if (!tool.websiteUrl) continue;
    try {
      const res = await fetch(tool.websiteUrl, { redirect: "follow" });
      if (!res.ok) continue;
      const html = await res.text();
      const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
      const desc = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)?.[1];
      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          shortDescription: tool.shortDescription ?? desc ?? title,
          extractionNotes: `website:title=${title ?? ""}`,
          lastEnrichedAt: new Date()
        }
      });
    } catch {
      continue;
    }
  }
}
