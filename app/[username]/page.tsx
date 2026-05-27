'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NextLink from "next/link";
import { Link as LinkType } from "@/data/links";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Loader2 } from "lucide-react";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username: string;
  bio: string;
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.username) return;

    const fetchProfile = async () => {
      try {
        const usersRef = collection(db, "users");
        // params.username은 URL 파라미터이므로 decodeURIComponent 필요 시 사용
        const decodedUsername = decodeURIComponent(params.username);
        const q = query(usersRef, where("username", "==", decodedUsername));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UserProfile;
        setProfile(userData);

        // Fetch links
        const linksRef = collection(db, "users", userDoc.id, "links");
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        const linksSnapshot = await getDocs(linksQuery);
        
        const linksData: LinkType[] = [];
        linksSnapshot.forEach((doc) => {
          linksData.push({ id: doc.id, ...doc.data() } as LinkType);
        });
        
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching public profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params?.username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#5B5FC7]" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black text-center space-y-6">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50 shadow-sm">
          <span className="text-3xl">🤔</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">페이지를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
            존재하지 않는 프로필이거나 주소가 잘못되었습니다.<br/>
            나만의 멋진 링크 트리를 만들어보시겠어요?
          </p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="mt-6 bg-[#5B5FC7] hover:bg-[#4A4EAB] text-white px-7 py-3.5 rounded-2xl font-semibold shadow-lg shadow-[#5B5FC7]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          My Link 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-md flex flex-col items-center gap-8 mt-12 mb-20">
        {/* 프로필 영역 */}
        <header className="text-center space-y-5 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white/50 dark:border-slate-800/50 shadow-2xl ring-4 ring-[#5B5FC7]/10 flex items-center justify-center bg-white backdrop-blur-sm">
            {profile.photoURL ? (
              <Image 
                src={profile.photoURL} 
                alt={profile.displayName || "User"} 
                fill 
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#5B5FC7] to-indigo-500 text-white flex items-center justify-center text-4xl font-bold uppercase shadow-inner">
                {(profile.displayName || profile.username || "U").charAt(0)}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-sm">
              {profile.displayName || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p className="text-slate-600 dark:text-slate-400 text-[15px] font-medium max-w-[300px] mx-auto leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>
        </header>

        {/* 링크 목록 영역 */}
        <main className="w-full flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          {links.length === 0 ? (
            <div className="text-center p-10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-dashed border-border/50 shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">아직 등록된 링크가 없습니다.</p>
            </div>
          ) : (
            links.map((link) => {
              let domain = "example.com";
              try {
                domain = new URL(link.url).hostname;
              } catch {
                domain = link.url;
              }
              const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full group"
                >
                  <Card className="relative overflow-hidden border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#5B5FC7]/15 hover:-translate-y-1 hover:border-[#5B5FC7]/40 hover:bg-white/90 dark:hover:bg-slate-900/90 group-active:scale-[0.98] rounded-[24px]">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 pr-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-border/30 overflow-hidden group-hover:border-[#5B5FC7]/30 transition-colors group-hover:shadow-[#5B5FC7]/10">
                          <Image
                            src={faviconUrl}
                            alt={`${link.title} icon`}
                            width={28}
                            height={28}
                            className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                          />
                        </div>
                        <CardTitle className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-[#5B5FC7] dark:group-hover:text-indigo-400 transition-colors">
                          {link.title}
                        </CardTitle>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-[#5B5FC7] transition-colors duration-300">
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              );
            })
          )}
        </main>
      </div>

      <footer className="mt-auto pb-8 pt-4 animate-in fade-in duration-1000 delay-300 fill-mode-both">
        <NextLink 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-[0.2em] uppercase hover:bg-white/80 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          Made with <span className="text-[#5B5FC7] dark:text-indigo-400 font-extrabold ml-[-2px]">My Link</span>
        </NextLink>
      </footer>
    </div>
  );
}
