import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { links } from "@/data/links"
import Image from "next/image"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md flex flex-col gap-4">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">My Links</h1>
          <p className="text-muted-foreground">나의 모든 소셜 링크를 한곳에서 확인하세요.</p>
        </header>

        <main className="flex flex-col gap-4">
          {links.map((link) => {
            const domain = new URL(link.url).hostname;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-102 active:scale-98"
              >
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={faviconUrl}
                        alt={`${link.title} icon`}
                        width={32}
                        height={32}
                        className="rounded-sm"
                        unoptimized
                      />
                    </div>
                    <CardTitle className="text-base font-medium">{link.title}</CardTitle>
                  </CardHeader>
                </Card>
              </a>
            )
          })}
        </main>
      </div>
    </div>
  )
}
