import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { links } from "@/data/links"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-md flex flex-col items-center gap-10 mt-20">
        <header className="text-center space-y-3">
          <div className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
            Developer & Creator
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            My Links
          </h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
            Exploring the intersection of code and design. Find all my social channels below.
          </p>
        </header>

        <main className="w-full flex flex-col gap-3">
          {links.map((link) => {
            const domain = new URL(link.url).hostname;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full"
              >
                <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 group-active:scale-[0.98]">
                  <CardHeader className="flex flex-row items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-border/50 overflow-hidden group-hover:border-primary/20 transition-colors">
                        <Image
                          src={faviconUrl}
                          alt={`${link.title} icon`}
                          width={24}
                          height={24}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <CardTitle className="text-base font-semibold tracking-tight">{link.title}</CardTitle>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </CardHeader>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:via-primary/[0.02] transition-all pointer-events-none" />
                </Card>
              </a>
            )
          })}
        </main>
      </div>

      <footer className="mt-20 mb-8">
        <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
          Made with <span className="text-primary font-bold">My Link</span>
        </p>
      </footer>
    </div>
  )
}
