export default function Home() {
  const experiences = [
    { 
      id: "LOG_01",
      title: "임직원 교육 플랫폼 구축", 
      role: "Lead QA Engineer",
      period: "2023.01 — PRESENT",
      metrics: "Stability 99.9% / Efficiency +40%",
      description: "플랫폼 전반의 품질 보증 및 프로세스 개선. 자동화 테스트 도입을 통한 회귀 테스트 시간 40% 단축 및 CI/CD 파이프라인 품질 게이트 구축." 
    },
    { 
      id: "LOG_02",
      title: "모바일 주문 프로세스 최적화", 
      role: "QA Engineer",
      period: "2022.03 — 2022.12",
      metrics: "Error Rate -15% / Coverage 85%",
      description: "사용자 중심의 주문 흐름 최적화 및 테스트. 결제 오류율 15% 감소 기여 및 런타임 예외 처리 로직 강화 검증." 
    },
    { 
      id: "LOG_03",
      title: "통합 회원 운영 시스템", 
      role: "QA Specialist",
      period: "2021.05 — 2022.02",
      metrics: "Data Integrity 100%",
      description: "회원 시스템 통합 과정의 데이터 정합성 검증 및 마이그레이션 품질 관리. 레거시 데이터 이관 자동화 스크립트 검증 담당." 
    },
    { 
      id: "LOG_04",
      title: "이커머스 앱 고도화 프로젝트", 
      role: "QA Engineer",
      period: "2020.01 — 2021.04",
      metrics: "Load Capacity +200%",
      description: "대규모 트래픽 대응을 위한 부하 테스트 및 UI/UX 품질 향상. 동시 접속자 처리 성능 개선을 위한 인프라 스트레스 테스트 수행." 
    },
  ];

  const skills = [
    { category: "Frameworks & Tools", items: ["Jira", "Confluence", "Selenium", "Appium", "Playwright"] },
    { category: "Technical Infrastructure", items: ["Postman", "SQL", "Git", "Docker", "Jenkins"] },
    { category: "Engineering Languages", items: ["JavaScript", "Python", "SQL", "TypeScript"] },
  ];

  const metrics = [
    { label: "Stability", value: "99.9%", status: "OPTIMAL" },
    { label: "Efficiency", value: "+40%", status: "INCREASED" },
    { label: "Coverage", value: "85%", status: "EXPANDED" },
    { label: "Response", value: "< 24H", status: "STABLE" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden font-sans">
      {/* SYSTEM HEADER / STATUS BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6 py-3 font-mono text-[10px] uppercase tracking-widest">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="font-bold">USANG.SYS</span>
              <span className="text-zinc-400">/</span>
              <span className="text-zinc-500">PROFILE_v2.0</span>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-zinc-400">
              <span>BITRATE: 128KBPS</span>
              <span>ENCODING: UTF-8</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden xs:inline">STATUS: ONLINE</span>
            </div>
            <div className="hidden sm:block text-zinc-500">
              LOC: SEOUL_KR [37.5665° N, 126.9780° E]
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 space-y-24 md:space-y-48">
        {/* [01] HERO / SYSTEM IDENTITY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-12 space-y-12">
            <div className="inline-block px-3 py-1 border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              [01] SYSTEM_IDENTITY_INITIALIZED
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-medium tracking-tighter leading-[0.8] mb-[-0.05em]">
                유우상
              </h1>
              <div className="font-mono text-xs sm:text-sm text-zinc-500 space-y-1 uppercase text-left md:text-right">
                <div>CORE_ROLE: QUALITY_ASSURANCE</div>
                <div>FOCUS: SYSTEMATIC_RELIABILITY</div>
                <div>EXP_LEVEL: SENIOR_FIELD</div>
              </div>
            </div>
            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <p className="text-2xl sm:text-3xl md:text-4xl font-light text-zinc-600 dark:text-zinc-400 leading-[1.1] tracking-tight max-w-3xl">
                  Quality Assurance Engineer focused on building systematic reliability and clear communication frameworks for high-performance software environments.
                </p>
              </div>
              <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden">
                {metrics.map((m, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-950 p-6 space-y-2">
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{m.label}</div>
                    <div className="text-3xl font-medium tracking-tighter">{m.value}</div>
                    <div className="font-mono text-[9px] text-emerald-600 dark:text-emerald-500 font-bold tracking-widest">{m.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* [02] ANALYTICS / OBJECTIVE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <div className="lg:col-span-4 space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              [02] ANALYTICAL_OBJECTIVE
            </div>
            <h2 className="text-3xl font-medium tracking-tight">Core Mission</h2>
          </div>
          <div className="lg:col-span-8">
            <div className="p-8 md:p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-900 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-zinc-300 dark:text-zinc-700 uppercase">
                OBJECTIVE_LOG_001
              </div>
              <p className="text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-light">
                요구사항을 바탕으로 이슈를 정확히 찾아내고, 명확한 커뮤니케이션으로 서비스 품질을 개선합니다. 단순한 버그 탐지를 넘어, 개발 프로세스 전반의 시스템적 효율성을 추구합니다.
              </p>
              <div className="mt-8 flex gap-4">
                {["#PRECISION", "#SYSTEMATIC", "#RELIABLE"].map((tag) => (
                  <span key={tag} className="font-mono text-[10px] text-zinc-500">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* [03] WORK_LOG / EXPERIENCE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-zinc-200 dark:border-zinc-800 pt-16 items-start">
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              [03] EXPERIENCE_WORK_LOG
            </div>
            <h2 className="text-3xl font-medium tracking-tight">Career Architecture</h2>
          </div>
          <div className="lg:col-span-8 space-y-12 mt-4 lg:mt-0">
            {experiences.map((exp, index) => (
              <div key={index} className="group relative pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 ring-4 ring-white dark:ring-zinc-950"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded inline-block w-fit">
                    {exp.id} / {exp.period}
                  </div>
                  <div className="font-mono text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-tight sm:tracking-widest">
                    {exp.metrics}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-medium tracking-tight group-hover:text-zinc-500 transition-colors break-words">
                    {exp.title}
                  </h3>
                  <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                    ROLE: {exp.role}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl font-light">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* [04] CAPABILITIES / SKILLS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <div className="lg:col-span-4 space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              [04] CAPABILITY_MATRIX
            </div>
            <h2 className="text-3xl font-medium tracking-tight">Tech Stack</h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden">
            {skills.map((skillGroup, index) => (
              <div key={index} className="bg-white dark:bg-zinc-950 p-8 space-y-6">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-4">
                  {skillGroup.items.map((skill, sIndex) => (
                    <li key={sIndex} className="flex flex-col gap-1">
                      <span className="text-sm font-medium tracking-tight">{skill}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div key={dot} className={`h-1 flex-1 rounded-full ${dot <= 4 ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-100 dark:bg-zinc-900'}`}></div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* [05] CONNECT / TERMINAL */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-32">
          <div className="lg:col-span-4 space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              [05] COMMUNICATION_PROTOCOL
            </div>
            <h2 className="text-3xl font-medium tracking-tight">Let&apos;s talk</h2>
          </div>
          <div className="lg:col-span-8 space-y-12">
            <div className="group relative inline-block max-w-full">
              <a 
                href="mailto:contact@usang.sys" 
                className="text-2xl sm:text-4xl md:text-6xl font-medium tracking-tighter hover:text-zinc-500 transition-colors break-words block"
              >
                REQUEST_COLLABORATION
              </a>
              <div className="absolute -bottom-2 left-0 w-0 h-1 bg-zinc-900 dark:bg-zinc-100 group-hover:w-full transition-all duration-500"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "GITHUB", link: "#" },
                { label: "LINKEDIN", link: "#" },
                { label: "RESUME_PDF", link: "#" },
                { label: "EMAIL", link: "mailto:contact@usang.sys" },
              ].map((social) => (
                <a 
                  key={social.label}
                  href={social.link} 
                  className="flex flex-col gap-2 group"
                >
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest">{social.label}</span>
                  <span className="text-xs font-medium group-hover:underline underline-offset-4">ACCESS_LINK</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER / SYSTEM TERMINATION */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-12 font-mono text-[10px] text-zinc-400 uppercase tracking-[0.3em]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <p>© {new Date().getFullYear()} USANG.SYS / ALL_RIGHTS_RESERVED.</p>
            <p className="text-zinc-500">ENGINEERED_WITH_PRECISION_VIA_NEXTJS_16</p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500">SYSTEM_VERSION</span>
              <span className="text-zinc-300">2.0.4_BUILD_2026.05.13</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500">LICENSE</span>
              <span className="text-zinc-300">MIT_PERSONAL_USE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
