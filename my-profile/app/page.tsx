export default function Home() {
  const experiences = [
    { title: "임직원 교육 플랫폼 구축", description: "플랫폼 전반의 품질 보증 및 프로세스 개선" },
    { title: "모바일 주문 프로세스", description: "사용자 중심의 주문 흐름 최적화 및 테스트" },
    { title: "통합 회원 운영", description: "회원 시스템 통합 과정의 데이터 정합성 검증" },
    { title: "이커머스 앱 고도화", description: "대규모 트래픽 대응 및 UI/UX 품질 향상" },
    { title: "금융 앱 구축 및 운영", description: "보안 및 규정 준수를 위한 엄격한 QA 수행" },
  ];

  const skills = ["Jira", "Confluence", "Postman", "Selenium", "Appium", "SQL"];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 space-y-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                <span className="text-4xl">👨‍💻</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              유우상
            </h1>
            <p className="text-2xl font-medium text-indigo-600 dark:text-indigo-400">
              Quality Assurance Engineer
            </p>
            <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mx-auto">
              요구사항을 바탕으로 이슈를 정확히 찾아내고,<br />
              명확한 커뮤니케이션으로 서비스 품질을 개선합니다.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-semibold hover:scale-105 transition-transform cursor-pointer">
              Contact Me
            </button>
            <button className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
              View Projects
            </button>
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
            <div className="h-px flex-grow bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all"
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {exp.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Skills & Tools</h2>
            <div className="h-px flex-grow bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 dark:text-zinc-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} 유우상. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Github</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Resume</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
