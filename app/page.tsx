'use client';

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardTitle } from "@/components/ui/card"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link as LinkType } from "@/data/links"
import Image from "next/image"
import { ArrowUpRight, Plus, Trash2, Pencil, Check, X, LogOut, Lock, Eye, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { db, auth } from "@/lib/firebase"
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore"

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username: string;
  bio: string;
}

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
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Firebase Auth 상태
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 프로필 편집 상태
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ displayName: "", username: "", bio: "" });

  // 인라인 편집 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editUrl, setEditUrl] = useState<string>("");
  const [editErrors, setEditErrors] = useState<{ title?: string; url?: string }>({});

  // 삭제 대상 링크 상태
  const [deleteTargetLink, setDeleteTargetLink] = useState<LinkType | null>(null);

  // 링크 복사 완료 모달 상태
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  const fetchLinks = async (uid: string) => {
    if (!uid) return;
    const linksCol = collection(db, "users", uid, "links");
    const q = query(linksCol, orderBy("createdAt", "desc"));
    
    try {
      const querySnapshot = await getDocs(q);
      const linksData: LinkType[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        linksData.push({ id: doc.id, ...data } as LinkType);
      });

      setLinks(linksData);
    } catch (error) {
      console.error("Error fetching links: ", error);
    }
  };

  // Auth 상태 실시간 감지 및 링크 조회
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const profileRef = doc(db, "users", currentUser.uid);
          const profileSnap = await getDoc(profileRef);
          
          let profileData: UserProfile;
          if (profileSnap.exists()) {
            profileData = profileSnap.data() as UserProfile;
          } else {
            const emailPrefix = currentUser.email ? currentUser.email.split('@')[0] : "user";
            profileData = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: emailPrefix,
              photoURL: currentUser.photoURL,
              username: currentUser.displayName || "user",
              bio: "",
            };
            await setDoc(profileRef, profileData);
          }
          setUserProfile(profileData);
          await fetchLinks(currentUser.uid);
        } catch (error) {
          console.error("Error fetching/creating profile:", error);
        }
      } else {
        setUserProfile(null);
        setLinks([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      const firebaseError = error as { code?: string };
      const errorMessage = firebaseError?.code 
        ? `로그인 중 오류가 발생했습니다. (오류 코드: ${firebaseError.code})` 
        : "로그인 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLinks([]);
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handlePreviewPage = () => {
    if (!userProfile?.username) {
      alert("프로필 정보가 아직 로드되지 않았습니다.");
      return;
    }
    const profileUrl = `${window.location.origin}/${userProfile.username}`;
    window.open(profileUrl, '_blank');
  };

  const handleCopyLink = async () => {
    if (!userProfile?.username) {
      alert("프로필 정보가 아직 로드되지 않았습니다.");
      return;
    }
    const profileUrl = `${window.location.origin}/${userProfile.username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopyModalOpen(true);
    } catch (err) {
      console.error("Failed to copy link: ", err);
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleStartEditProfile = () => {
    if (userProfile) {
      setEditProfileData({
        displayName: userProfile.displayName || "",
        username: userProfile.username || "",
        bio: userProfile.bio || "",
      });
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !userProfile) return;
    try {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, {
        displayName: editProfileData.displayName,
        username: editProfileData.username,
        bio: editProfileData.bio,
      });
      setUserProfile({
        ...userProfile,
        displayName: editProfileData.displayName,
        username: editProfileData.username,
        bio: editProfileData.bio,
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  const handleStartEdit = (link: LinkType) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditErrors({});
  };

  const handleSaveEdit = async (id: string) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const result = linkSchema.safeParse({ title: editTitle, url: editUrl });
    if (!result.success) {
      const fieldErrors: { title?: string; url?: string } = {};
      const { fieldErrors: errors } = result.error.flatten();
      if (errors.title) fieldErrors.title = errors.title[0];
      if (errors.url) fieldErrors.url = errors.url[0];
      setEditErrors(fieldErrors);
      return;
    }

    let formattedUrl = editUrl;
    if (!/^https?:\/\//i.test(editUrl)) {
      formattedUrl = "https://" + editUrl;
    }

    try {
      const linkRef = doc(db, "users", user.uid, "links", id);
      await updateDoc(linkRef, {
        title: editTitle,
        url: formattedUrl,
      });
      setEditingId(null);
      setEditTitle("");
      setEditUrl("");
      setEditErrors({});
      // 목록 갱신
      await fetchLinks(user.uid);
    } catch (error) {
      console.error("Error updating link: ", error);
      alert("링크 수정 중 오류가 발생했습니다.");
    }
  };



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

  const onSubmit = async (data: LinkFormValues) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    let formattedUrl = data.url;
    if (!/^https?:\/\//i.test(data.url)) {
      formattedUrl = 'https://' + data.url;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "links"), {
        title: data.title,
        url: formattedUrl,
        createdAt: serverTimestamp(),
      });
      
      setIsOpen(false);
      reset();
      // 추가 후 목록 갱신
      await fetchLinks(user.uid);
    } catch (error) {
      console.error("Error adding link: ", error);
      alert("링크 추가 중 오류가 발생했습니다.");
    }
  };

  const handleRequestDelete = (link: LinkType) => {
    setDeleteTargetLink(link);
  };

  const handleConfirmDelete = async () => {
    if (!user || !deleteTargetLink) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "links", deleteTargetLink.id));
      setDeleteTargetLink(null);
      // 삭제 후 목록 갱신
      await fetchLinks(user.uid);
    } catch (error) {
      console.error("Error deleting link: ", error);
      alert("링크 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCancelDelete = () => {
    setDeleteTargetLink(null);
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
        {/* 상단 헤더 바 */}
        <div className="w-full flex justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-border/40 shadow-sm">
          {/* 좌측: 로고 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold bg-gradient-to-r from-[#5B5FC7] to-indigo-500 bg-clip-text text-transparent tracking-tight">
              My Link
            </span>
          </div>

          {/* 우측: 액션 버튼 그룹 / 프로필 */}
          <div className="flex items-center gap-2">
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger 
                  render={
                    <button className="relative w-8 h-8 rounded-full overflow-hidden border border-border/50 hover:border-[#5B5FC7]/50 shadow-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]/20">
                      {(userProfile?.photoURL || user.photoURL) ? (
                        <Image 
                          src={userProfile?.photoURL || user.photoURL || ""} 
                          alt={userProfile?.displayName || user.displayName || "user"} 
                          fill 
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-[#5B5FC7] text-white flex items-center justify-center text-xs font-bold uppercase">
                          {(userProfile?.displayName || user.displayName || "U").charAt(0)}
                        </div>
                      )}
                    </button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile?.displayName || user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{userProfile?.email || user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handlePreviewPage} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    <span>내 페이지 미리보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" />
                    <span>링크 복사</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleGoogleSignIn}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5 h-8 text-xs shadow-sm dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900"
              >
                <svg className="w-3.5 h-3.5 mr-0.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.41 0-6.173-2.762-6.173-6.173s2.763-6.173 6.173-6.173c1.5 0 2.873.535 3.96 1.488l3.076-3.076C18.91 1.764 15.75 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.977 0-.728-.063-1.425-.182-2.109H12.24z"/>
                </svg>
                Google로 로그인
              </Button>
            )}
          </div>
        </div>

        {authLoading ? (
          <header className="text-center space-y-3 animate-pulse">
            <div className="w-24 h-6 bg-muted mx-auto rounded-full mb-2" />
            <div className="w-48 h-10 bg-muted mx-auto rounded-lg" />
            <div className="w-64 h-4 bg-muted mx-auto rounded mt-2" />
          </header>
        ) : !user || !userProfile ? (
          <header className="text-center space-y-3">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
              Link-in-bio Service
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              My Link
            </h1>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
              크리에이터와 개발자를 위한 심플한 링크 관리 서비스입니다. 가입하고 나만의 링크 트리를 만들어보세요.
            </p>
          </header>
        ) : isEditingProfile ? (
          <header className="w-full max-w-sm mx-auto text-center space-y-4 bg-card/50 p-6 rounded-2xl border border-border/50 shadow-sm backdrop-blur-md">
            <div className="space-y-3 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="edit-profile-name" className="text-xs text-muted-foreground">이름 (Display Name)</Label>
                <Input 
                  id="edit-profile-name" 
                  value={editProfileData.displayName} 
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="bg-background/50 h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-profile-username" className="text-xs text-muted-foreground">유저네임 (Username)</Label>
                <Input 
                  id="edit-profile-username" 
                  value={editProfileData.username} 
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-background/50 h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-profile-bio" className="text-xs text-muted-foreground">소개 (Bio)</Label>
                <Input 
                  id="edit-profile-bio" 
                  value={editProfileData.bio} 
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-background/50 h-9"
                  placeholder="한 줄 소개를 입력해주세요."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditingProfile(false)} className="h-8 text-xs">취소</Button>
              <Button size="sm" onClick={handleSaveProfile} className="h-8 text-xs bg-[#5B5FC7] hover:bg-[#4A4EAB] text-white">저장</Button>
            </div>
          </header>
        ) : (
          <header 
            className="text-center space-y-3 group relative cursor-pointer p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors" 
            onClick={handleStartEditProfile}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
              @{userProfile.username || "username"}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {userProfile.displayName || "My Links"}
            </h1>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
              {userProfile.bio || "나의 모든 소셜 채널과 포트폴리오를 한 곳에서 관리하세요. 클릭하여 프로필을 수정할 수 있습니다."}
            </p>
          </header>
        )}

        <main className="w-full flex flex-col gap-3">
          {authLoading ? (
            /* 로딩 스켈레톤 */
            <div className="space-y-3 w-full">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-full h-[80px] bg-muted/40 animate-pulse rounded-2xl border border-border/40" />
              ))}
            </div>
          ) : !user ? (
            /* 비로그인 웰컴 카드 */
            <Card className="border-border/50 bg-card/40 backdrop-blur-md p-8 text-center space-y-6 shadow-xl shadow-primary/5 rounded-2xl w-full">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-[#5B5FC7]/10 flex items-center justify-center text-[#5B5FC7] mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl font-bold tracking-tight">나만의 링크 관리 시작하기</CardTitle>
                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                  구글 계정으로 로그인하여 나만의 포트폴리오와 소셜 미디어 링크를 한 곳에서 안전하게 관리해보세요.
                </p>
              </div>
              <div className="pt-2">
                <Button 
                  onClick={handleGoogleSignIn}
                  className="bg-[#5B5FC7] hover:bg-[#4A4EAB] text-white w-full h-11 rounded-xl shadow-md shadow-[#5B5FC7]/20 font-semibold gap-2 transition-all hover:scale-[1.01]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.41 0-6.173-2.762-6.173-6.173s2.763-6.173 6.173-6.173c1.5 0 2.873.535 3.96 1.488l3.076-3.076C18.91 1.764 15.75 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.977 0-.728-.063-1.425-.182-2.109H12.24z"/>
                  </svg>
                  Google 계정으로 로그인
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* 링크 추가 버튼 (목록 상단) */}
              <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger 
                  render={
                    <Button 
                      variant="outline" 
                      className="w-full h-14 border-dashed border-2 border-border/70 hover:border-[#5B5FC7]/50 hover:bg-[#5B5FC7]/5 text-muted-foreground hover:text-[#5B5FC7] transition-all rounded-2xl flex items-center justify-center gap-2 mb-2 bg-card/40 backdrop-blur-sm shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-semibold text-sm">새 링크 추가하기</span>
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

              {links.length === 0 ? (
                /* 등록된 링크가 없는 로그인 사용자 */
                <Card className="border-dashed border-2 border-border/70 bg-card/20 p-8 text-center space-y-4 rounded-2xl w-full">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    아직 등록된 링크가 없습니다.<br />위의 버튼을 눌러 첫 링크를 추가해보세요!
                  </p>
                </Card>
              ) : (
                /* 링크 목록 출력 */
                links.map((link) => {
              const isEditing = editingId === link.id;

              if (isEditing) {
                return (
                  <Card 
                    key={link.id} 
                    className="relative overflow-hidden border-primary/40 bg-card/80 backdrop-blur-md p-5 space-y-4 shadow-xl shadow-primary/5 ring-1 ring-primary/20 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor={`edit-title-${link.id}`} className="text-xs font-semibold text-muted-foreground">제목</Label>
                        <Input
                          id={`edit-title-${link.id}`}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="예: 인스타그램"
                          className={cn(
                            "bg-background/50 border-border/80 focus-visible:ring-[#5B5FC7]",
                            editErrors.title && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {editErrors.title && (
                          <p className="text-[0.75rem] font-medium text-destructive mt-0.5">
                            {editErrors.title}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`edit-url-${link.id}`} className="text-xs font-semibold text-muted-foreground">주소 (URL)</Label>
                        <Input
                          id={`edit-url-${link.id}`}
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="example.com"
                          className={cn(
                            "bg-background/50 border-border/80 focus-visible:ring-[#5B5FC7]",
                            editErrors.url && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {editErrors.url && (
                          <p className="text-[0.75rem] font-medium text-destructive mt-0.5">
                            {editErrors.url}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="gap-1.5 h-8 text-xs px-3 border-border hover:bg-muted"
                      >
                        <X className="w-3.5 h-3.5" />
                        취소
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(link.id)}
                        className="bg-[#5B5FC7] hover:bg-[#4A4EAB] text-white gap-1.5 h-8 text-xs px-3 transition-colors shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        저장
                      </Button>
                    </div>
                  </Card>
                );
              }

              let domain = "example.com";
              try {
                domain = new URL(link.url).hostname;
              } catch {
                domain = link.url;
              }
              const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

              return (
                <Card 
                  key={link.id} 
                  className="w-full overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 flex items-center justify-between"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 group/link"
                  >
                    <div className="flex items-center gap-4 py-4 pl-5 pr-3">
                      <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-border/50 overflow-hidden shrink-0">
                        <Image
                          src={faviconUrl}
                          alt={`${link.title} icon`}
                          width={24}
                          height={24}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <CardTitle className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100 group-hover/link:text-[#5B5FC7] dark:group-hover/link:text-indigo-400 transition-colors truncate">
                          {link.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {domain}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover/link:text-[#5B5FC7] dark:group-hover/link:text-indigo-400 transition-colors duration-300 shrink-0 mr-1" />
                    </div>
                  </a>

                  {/* 구분선 */}
                  <div className="h-8 w-[1px] bg-border/40 shrink-0" />

                  {/* 수정, 삭제 액션 버튼 영역 */}
                  <div className="flex items-center gap-1 px-4 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(link)}
                      className="text-muted-foreground hover:text-primary hover:bg-muted h-9 w-9 rounded-xl transition-colors"
                      title="수정"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRequestDelete(link)}
                      className="text-muted-foreground hover:text-destructive hover:bg-muted h-9 w-9 rounded-xl transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
            </>
          )}
        </main>
      </div>

      <footer className="mt-20 mb-8">
        <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
          Made with <span className="text-primary font-bold">My Link</span>
        </p>
      </footer>

      {/* 링크 삭제 확인 커스텀 모달 */}
      <Dialog 
        open={deleteTargetLink !== null} 
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">정말 삭제하시겠습니까</DialogTitle>
            <DialogDescription className="pt-3 text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                &ldquo;{deleteTargetLink?.title}&rdquo;
              </span>{" "}
              링크가 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <p className="text-sm font-semibold text-destructive/90 flex items-center gap-1.5 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <span>⚠️ 이 작업은 되돌릴 수 없습니다</span>
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="w-full sm:w-auto h-10"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto h-10 bg-destructive hover:bg-destructive/90 text-white"
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 링크 복사 완료 모달 */}
      <Dialog 
        open={isCopyModalOpen} 
        onOpenChange={setIsCopyModalOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">알림</DialogTitle>
            <DialogDescription className="pt-3 text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              내 링크 복사가 완료되었습니다
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => setIsCopyModalOpen(false)}
              className="w-full bg-[#5B5FC7] hover:bg-[#4A4EAB] text-white h-11 text-base font-semibold"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
