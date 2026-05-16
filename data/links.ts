export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const links: Link[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com/yourusername",
    icon: "instagram",
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com/@yourchannel",
    icon: "youtube",
  },
  {
    id: "3",
    title: "블로그",
    url: "https://blog.example.com",
    icon: "blog",
  },
  {
    id: "4",
    title: "Github",
    url: "https://github.com/yourusername",
    icon: "github",
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://portfolio.example.com",
    icon: "portfolio",
  },
];
