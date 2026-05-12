export default function Home() {
  const experiences = [
    "임직원 교육 플랫폼 구축",
    "모바일 주문 프로세스",
    "통합 회원 운영",
    "이커머스 앱 고도화",
    "금융 앱 구축 및 운영",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 font-sans">
      <main className="flex flex-col items-center max-w-2xl w-full text-center space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            유우상
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            요구사항을 바탕으로 이슈를 정확히 찾아내고,<br />
            명확한 커뮤니케이션으로 서비스 품질을 개선하는 QA입니다.
          </p>
        </section>

        <section className="w-full space-y-6">
          <h2 className="text-lg font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
            Experience
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {experiences.map((exp, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm text-zinc-700 dark:text-zinc-300 shadow-sm"
              >
                {exp}
              </span>
            ))}
          </div>
        </section>

        <footer className="pt-12 text-zinc-400 dark:text-zinc-600 text-sm">
          © {new Date().getFullYear()} 유우상. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
