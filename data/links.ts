export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const links: Link[] = [
  {
    id: "1",
    title: "Youtube",
    url: "https://youtube.com/@yourchannel",
    icon: "youtube",
  },
  {
    id: "2",
    title: "Instagram",
    url: "https://instagram.com/yourusername",
    icon: "instagram",
  },
  {
    id: "3",
    title: "Blog",
    url: "https://blog.example.com",
    icon: "blog",
  },
  {
    id: "4",
    title: "Portfolio",
    url: "https://portfolio.example.com",
    icon: "portfolio",
  },
  {
    id: "5",
    title: "Github",
    url: "https://github.com/yourusername",
    icon: "github",
  },
];
