'use client';

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { links as initialLinks, Link as LinkType } from "@/data/links"
import Image from "next/image"
import { ArrowUpRight, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const linkSchema = z.object({
  title: z.string()
    .min(1, "제목을 입력해주세요.")
    .max(20, "제목은 20자 이내로 입력해주세요."),
  url: z.string()
    .min(1, "주소를 입력해주세요.")
    .refine((val) => !/\s/.test(val), "주소에 공백을 포함할 수 없습니다.")
    .refine((val) => {
      // 아주 기본적인 도메인/URL 형식 체크
      return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(val);
    }, "유효한 주소 형식이 아닙니다."),
})

type LinkFormValues = z.infer<typeof linkSchema>;

export default function Page() {
  const [links, setLinks] = useState<LinkType[]>(initialLinks);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = (data: LinkFormValues) => {
    let formattedUrl = data.url;
    if (!/^https?:\/\//i.test(data.url)) {
      formattedUrl = 'https://' + data.url;
    }

    const newLink: LinkType = {
      id: crypto.randomUUID(),
      title: data.title,
      url: formattedUrl,
    };

    setLinks([...links, newLink]);
    setIsOpen(false);
    reset();
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-md flex flex-col items-center gap-10 mt-10">
        <div className="w-full flex justify-end">
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger 
              render={
                <Button variant="outline" size="sm" className="gap-2 border-[#5B5FC7] text-[#5B5FC7] hover:bg-[#5B5FC7] hover:text-white transition-all">
                  <Plus className="w-4 h-4" />
                  링크 추가
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>새 링크 추가</DialogTitle>
                  <DialogDescription>
                    프로필에 표시할 새로운 링크 정보를 입력해주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className={cn(errors.title && "text-destructive")}>제목</Label>
                    <Input
                      id="title"
                      placeholder="예: 인스타그램"
                      {...register("title")}
                      className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.title && (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url" className={cn(errors.url && "text-destructive")}>주소 (URL)</Label>
                    <Input
                      id="url"
                      placeholder="example.com"
                      {...register("url")}
                      className={cn(errors.url && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.url && (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {errors.url.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-[#5B5FC7] hover:bg-[#4A4EAB] text-white w-full">추가하기</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

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
            let domain = "example.com";
            try {
              domain = new URL(link.url).hostname;
            } catch {
              domain = link.url;
            }
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

            return (
              <div key={link.id} className="group relative">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleDeleteLink(link.id);
                  }}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
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
