import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  AlertCircle,
  Check,
  X,
  Play
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MotionReveal } from './MotionReveal';
import {
  LESSONS_DATA,
  LESSONS_BY_SLUG,
  CURRICULUM_PHASES,
  LessonItem,
  QuizQuestion
} from '../data/flwLessonsData';

interface EducationViewProps {
  onBack: () => void;
  currentSlug?: string | null;
  onNavigateSlug?: (slug: string | null) => void;
  initialLessonSlug?: string | null;
}

export const EducationView: React.FC<EducationViewProps> = ({
  onBack,
  currentSlug = null,
  onNavigateSlug,
  initialLessonSlug = null
}) => {
  const activeSlug = currentSlug !== undefined ? currentSlug : initialLessonSlug;
  const [selectedLessonSlug, setSelectedLessonSlug] = useState<string | null>(
    activeSlug || null
  );

  const handleSelectLesson = (slug: string | null) => {
    setSelectedLessonSlug(slug);
    if (onNavigateSlug) {
      onNavigateSlug(slug);
    }
  };

  useEffect(() => {
    if (currentSlug !== undefined) {
      setSelectedLessonSlug(currentSlug);
    }
  }, [currentSlug]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flw_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quiz state for current lesson
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  

  useEffect(() => {
    // Reset quiz state when switching lessons
    setUserAnswers({});
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedLessonSlug]);

  const activeLesson: LessonItem | undefined = selectedLessonSlug
    ? LESSONS_BY_SLUG[selectedLessonSlug]
    : undefined;

  const toggleLessonComplete = (slug: string) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem('flw_completed_lessons', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const currentLessonIndex = activeLesson
    ? LESSONS_DATA.findIndex((l) => l.slug === activeLesson.slug)
    : -1;
  const prevLesson = currentLessonIndex > 0 ? LESSONS_DATA[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < LESSONS_DATA.length - 1
      ? LESSONS_DATA[currentLessonIndex + 1]
      : null;

  // -------------------------------------------------------------
  // LESSON DETAIL VIEW
  // -------------------------------------------------------------
  if (activeLesson) {
    const isModel = activeLesson.phaseNum === '04';
    const isCompleted = completedLessons.includes(activeLesson.slug);

    return (
      <div className="w-full min-h-screen pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-hair-1)]">
          <button
            onClick={() => handleSelectLesson(null)}
            className="inline-flex items-center gap-2 text-[12.5px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Curriculum Overview</span>
          </button>

          <div className="flex items-center gap-2 text-[12px] font-mono text-[var(--color-ink-4)]">
            <span>Education</span>
            <span>/</span>
            <span className="text-[var(--color-brand-blue-soft)]">
              {activeLesson.phase}
            </span>
            <span>/</span>
            <span className="text-white truncate max-w-[200px] sm:max-w-none">
              {activeLesson.title}
            </span>
          </div>
        </div>

        {/* Lesson Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-blue-soft)] font-semibold">
              {activeLesson.phase} · {activeLesson.category}
            </span>
          </div>

          <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-bold tracking-tight text-white leading-tight mb-4">
            {activeLesson.title}
          </h1>

          <p className="text-[16px] text-[var(--color-ink-2)] max-w-3xl leading-relaxed mb-6">
            {activeLesson.subtitle}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Author */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] text-[12px]">
              <img
                src={activeLesson.authorAvatar}
                alt={activeLesson.author}
                className="w-5 h-5 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-white font-medium">{activeLesson.author}</span>
            </div>

            {/* Read Time */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-[var(--color-hair-1)] text-[12px] font-mono text-[var(--color-ink-3)]">
              <Clock className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
              <span>{activeLesson.readTime}</span>
            </div>

            {/* Join FLW Discord */}
            <a
              href="https://discord.gg/bsuM3urQCX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/25 text-[12px] text-[#7ab3ff] hover:bg-[#5865F2]/20 transition-colors font-medium"
            >
              <span>Join FLW Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Mark as Complete Button */}
            <button
              onClick={() => toggleLessonComplete(activeLesson.slug)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-mono transition-colors cursor-pointer ml-auto ${
                isCompleted
                  ? 'bg-[#22d68f]/10 text-[#22d68f] border border-[#22d68f]/30'
                  : 'bg-white/[0.03] text-[var(--color-ink-3)] border border-[var(--color-hair-1)] hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        {/* Phase 04 Model Disclaimer Notice */}
        {isModel && (
          <div className="mb-10 p-5 rounded-xl bg-[rgba(58,139,255,0.06)] border border-[rgba(58,139,255,0.2)] text-[13.5px] leading-relaxed text-[var(--color-ink-2)] flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-[var(--color-brand-blue)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">
                Orderflow Trading Models Notice
              </p>
              <p>
                Orderflow is a highly personalized and experience-based skill. These models are heavily simplified examples, presented almost as patterns and stripped of the discretion real trading requires. Developing a real edge requires extensive screen time and adapting the structure to your own read of the auction.
              </p>
            </div>
          </div>
        )}

        {/* Main Content Layout: Left Article + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Article Column */}
          <div className="lg:col-span-8 min-w-0">
            <article className="prose prose-invert max-w-none text-[15.5px] leading-relaxed text-[var(--color-ink-2)] space-y-6">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      id={String(props.children)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '')}
                      className="group flex items-center gap-3 font-display text-[1.65rem] md:text-[1.85rem] font-bold text-white tracking-tight mt-12 mb-4 pb-2.5 border-b border-[var(--color-hair-1)] scroll-mt-28"
                      {...props}
                    >
                      <span className="w-1 h-5 rounded-full bg-[var(--color-brand-blue)] shrink-0 opacity-80" />
                      <span>{props.children}</span>
                    </h2>
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="font-display text-[1.25rem] font-bold text-white tracking-tight mt-8 mb-3"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="font-mono text-[13px] uppercase tracking-wider text-[var(--color-brand-blue-soft)] font-semibold mt-6 mb-2"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="leading-relaxed mb-4 text-[var(--color-ink-2)]" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-white font-semibold" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="space-y-2 mb-4 pl-5 list-disc text-[var(--color-ink-2)]" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="space-y-2 mb-4 pl-5 list-decimal text-[var(--color-ink-2)]" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="pl-4 py-2 my-4 border-l-2 border-[var(--color-brand-blue)] bg-white/[0.02] rounded-r-lg text-[14.5px] italic text-[var(--color-ink-2)]"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-[var(--color-brand-blue)] hover:text-white underline underline-offset-4 decoration-[var(--color-brand-blue)]/50 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  hr: () => (
                    <hr className="my-10 border-t border-[var(--color-hair-1)]" />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-[var(--color-hair-1)] font-mono text-[13px] text-[#7ab3ff]"
                      {...props}
                    />
                  )
                }}
              >
                {activeLesson.contentMarkdown}
              </ReactMarkdown>
            </article>

            {/* Interactive Lesson Quiz */}
            {activeLesson.quizQuestions && activeLesson.quizQuestions.length > 0 && (
              <div className="mt-14 pt-10 border-t border-[var(--color-hair-1)]">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-[var(--color-brand-blue)]" />
                  <h3 className="font-display text-[1.4rem] font-bold text-white">
                    Knowledge Check
                  </h3>
                </div>
                <p className="text-[14px] text-[var(--color-ink-3)] mb-6">
                  Test your understanding of the concepts covered in this lesson.
                </p>

                <div className="space-y-6">
                  {activeLesson.quizQuestions.map((q, qIdx) => {
                    const isAnswered = userAnswers[qIdx] !== undefined;
                    const selectedOpt = userAnswers[qIdx];
                    const correctOpt = q.correct ?? 0;

                    return (
                      <div
                        key={qIdx}
                        className="p-5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-hair-1)]"
                      >
                        <p className="text-[15px] font-semibold text-white mb-4">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="space-y-2.5">
                          {q.options.map((opt, optIdx) => {
                            let optionClass =
                              'p-3 rounded-lg border text-[13.5px] transition-all text-left w-full cursor-pointer flex items-center justify-between ';

                            if (quizSubmitted) {
                              if (optIdx === correctOpt) {
                                optionClass +=
                                  'bg-[#22d68f]/10 border-[#22d68f]/40 text-[#22d68f] font-medium';
                              } else if (selectedOpt === optIdx) {
                                optionClass +=
                                  'bg-[#ff5252]/10 border-[#ff5252]/40 text-[#ff5252]';
                              } else {
                                optionClass +=
                                  'bg-white/[0.01] border-transparent text-[var(--color-ink-4)] opacity-50';
                              }
                            } else {
                              if (selectedOpt === optIdx) {
                                optionClass +=
                                  'bg-[var(--color-brand-blue)]/15 border-[var(--color-brand-blue)] text-white';
                              } else {
                                optionClass +=
                                  'bg-white/[0.02] border-[var(--color-hair-1)] text-[var(--color-ink-2)] hover:bg-white/[0.05] hover:text-white';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setUserAnswers((prev) => ({
                                    ...prev,
                                    [qIdx]: optIdx
                                  }))
                                }
                                className={optionClass}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === correctOpt && (
                                  <Check className="w-4 h-4 text-[#22d68f] shrink-0 ml-2" />
                                )}
                                {quizSubmitted &&
                                  selectedOpt === optIdx &&
                                  optIdx !== correctOpt && (
                                    <X className="w-4 h-4 text-[#ff5252] shrink-0 ml-2" />
                                  )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && q.explanation && (
                          <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-[var(--color-hair-1)] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
                            <span className="font-semibold text-white">Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quiz Action / Results */}
                <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={
                        Object.keys(userAnswers).length !==
                        activeLesson.quizQuestions.length
                      }
                      className="px-6 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all cursor-pointer bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-brand-blue-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Check Answers
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-[14px] font-mono">
                        Score:{' '}
                        <span className="text-[#22d68f] font-bold">
                          {
                            activeLesson.quizQuestions.filter(
                              (q, i) => userAnswers[i] === (q.correct ?? 0)
                            ).length
                          }
                        </span>{' '}
                        / {activeLesson.quizQuestions.length}
                      </div>
                      <button
                        onClick={() => {
                          setUserAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-4 py-2 rounded-xl text-[12.5px] font-mono text-[var(--color-ink-3)] hover:text-white bg-white/[0.03] border border-[var(--color-hair-1)] cursor-pointer"
                      >
                        Reset Quiz
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Pagination: Prev & Next Lesson */}
            <div className="mt-14 pt-8 border-t border-[var(--color-hair-1)] flex items-center justify-between gap-4">
              {prevLesson ? (
                <button
                  onClick={() => handleSelectLesson(prevLesson.slug)}
                  className="flex flex-col items-start p-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] hover:border-[var(--color-hair-3)] transition-all text-left cursor-pointer group max-w-[48%]"
                >
                  <span className="text-[11px] font-mono uppercase text-[var(--color-ink-4)] mb-1">
                    ← Previous Lesson
                  </span>
                  <span className="text-[14px] font-semibold text-white group-hover:text-[var(--color-brand-blue)] transition-colors truncate w-full">
                    {prevLesson.title}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <button
                  onClick={() => handleSelectLesson(nextLesson.slug)}
                  className="flex flex-col items-end p-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] hover:border-[var(--color-hair-3)] transition-all text-right cursor-pointer group max-w-[48%]"
                >
                  <span className="text-[11px] font-mono uppercase text-[var(--color-ink-4)] mb-1">
                    Next Lesson →
                  </span>
                  <span className="text-[14px] font-semibold text-white group-hover:text-[var(--color-brand-blue)] transition-colors truncate w-full">
                    {nextLesson.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar Column: Table of Contents & Curriculum Progress */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              {/* Table of Contents */}
              {activeLesson.tableOfContents && activeLesson.tableOfContents.length > 0 && (
                <div className="p-5 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-hair-1)]">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] font-semibold mb-3">
                    On this page
                  </h4>
                  <nav className="space-y-1 text-[13px]">
                    {activeLesson.tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block py-1 text-[var(--color-ink-3)] hover:text-white transition-colors truncate"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Curriculum Progress Navigator */}
              <div className="p-5 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] max-h-[500px] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] font-semibold">
                    Curriculum ({completedLessons.length}/{LESSONS_DATA.length})
                  </h4>
                </div>

                <div className="space-y-4">
                  {CURRICULUM_PHASES.map((phase) => (
                    <div key={phase.phase} className="space-y-1">
                      <div className="text-[11px] font-mono text-[var(--color-brand-blue-soft)] font-semibold">
                        {phase.phase} · {phase.title}
                      </div>

                      <div className="space-y-1 pl-2">
                        {phase.lessons.map((l) => {
                          const isCurrent = l.slug === activeLesson.slug;
                          const isDone = completedLessons.includes(l.slug);

                          return (
                            <button
                              key={l.slug}
                              onClick={() => handleSelectLesson(l.slug)}
                              className={`w-full flex items-center justify-between gap-2 py-1 px-2 rounded text-[12.5px] text-left transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-[var(--color-brand-blue)]/15 text-white font-medium'
                                  : 'text-[var(--color-ink-3)] hover:text-white'
                              }`}
                            >
                              <span className="truncate">{l.title}</span>
                              {isDone && (
                                <CheckCircle className="w-3.5 h-3.5 text-[#22d68f] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // CURRICULUM OVERVIEW (PHASE 01 TO PHASE 04) - EXACT TIMELINE
  // -------------------------------------------------------------
  return (
    <div className="w-full min-h-screen pt-28 md:pt-32 pb-0 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.08] bg-[var(--color-brand-blue)]" />
        <div className="absolute top-[40%] right-[-12%] w-[560px] h-[560px] rounded-full blur-[180px] opacity-[0.07] bg-[var(--color-brand-red)]" />
      </div>

      <div className="container mx-auto max-w-5xl px-6 pb-24">
        {/* Return to Home */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-8 text-[13px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home</span>
        </button>

        {/* Hero Header */}
        <div className="mb-20 md:mb-28">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-blue-soft)] mb-5">
            <span className="w-1 h-1 rounded-full bg-[var(--color-brand-blue)]" />
            Education · The Path
          </div>
          <h1 className="font-display text-[2.5rem] md:text-[4.5rem] font-bold text-[var(--color-ink-1)] tracking-[-0.05em] leading-[0.92]">
            The <span className="text-accent-blue">curriculum.</span>
          </h1>
          <p className="mt-6 text-[15px] md:text-[17px] text-[var(--color-ink-3)] max-w-xl leading-relaxed">
            A structured path from zero to professional. Every phase builds on the last. Don&apos;t skip steps.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Central Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-[linear-gradient(180deg,var(--color-brand-blue)_0%,transparent_8%,var(--color-hair-1)_20%,var(--color-hair-1)_80%,transparent_92%,var(--color-brand-blue)_100%)] md:-translate-x-px" />

          {/* ========================================================= */}
          {/* PHASE 01: SOFTWARE SETUP */}
          {/* ========================================================= */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-32">
            {/* Timeline Dot */}
            <div className="absolute left-[20px] md:left-1/2 top-1 md:top-4 w-[16px] h-[16px] rounded-full border-2 border-[var(--color-brand-blue)] bg-[var(--color-surface-0)] md:-translate-x-1/2 z-10">
              <div className="absolute inset-1 rounded-full bg-[var(--color-brand-blue)]" />
            </div>

            {/* Left Header Column */}
            <div className="pl-14 md:pl-0 md:pr-16">
              <div className="md:text-right">
                <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-blue-soft)] mb-4">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-brand-blue)]" />
                  Phase 01
                </span>
                <h2 className="font-display text-[1.8rem] md:text-[2.25rem] font-bold tracking-[-0.035em] mb-3 text-[var(--color-brand-blue)]">
                  Software Setup
                </h2>
                <p className="text-[var(--color-ink-3)] text-[14px] leading-relaxed mb-5 max-w-sm md:ml-auto">
                  Pick the right platform before you start.
                </p>
                <button
                  onClick={() => handleSelectLesson('software')}
                  className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] text-[13px] font-semibold hover:gap-3 transition-all cursor-pointer"
                >
                  <span>Compare platforms</span>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Cards 2x2 Grid */}
            <div className="pl-14 md:pl-16">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Quantower', desc: 'Modern & modular' },
                  { name: 'ATAS', desc: 'Advanced orderflow' },
                  { name: 'MotiveWave', desc: 'Feature-rich analysis' },
                  { name: 'Sierra Chart', desc: 'High performance' }
                ].map((sw) => (
                  <div key={sw.name} className="h-full">
                    <div
                      onClick={() => handleSelectLesson('software')}
                      className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-5 h-full hover:border-[var(--color-hair-3)] hover:bg-[var(--color-surface-2)] transition-all cursor-pointer group/card"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-80"
                      />
                      <div className="relative z-[1]">
                        <h3 className="font-semibold text-[var(--color-ink-1)] text-[13.5px] mb-1 tracking-[-0.01em] group-hover/card:text-white transition-colors">
                          {sw.name}
                        </h3>
                        <p className="text-[11.5px] text-[var(--color-ink-3)]">{sw.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PHASE 02: CORE KNOWLEDGE (Red dot, Cards left, Header right) */}
          {/* ========================================================= */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-32">
            {/* Timeline Dot */}
            <div className="absolute left-[20px] md:left-1/2 top-1 md:top-4 w-[16px] h-[16px] rounded-full border-2 border-[var(--color-brand-red)] bg-[var(--color-surface-0)] md:-translate-x-1/2 z-10">
              <div className="absolute inset-1 rounded-full bg-[var(--color-brand-red)]" />
            </div>

            {/* Left Cards Area (Order 2 on mobile, Order 1 on md) */}
            <div className="pl-14 md:pl-0 md:pr-16 order-2 md:order-1">
              <div className="space-y-3">
                {/* Hero Card: Auction Market Theory (AMT) */}
                <div
                  onClick={() => handleSelectLesson('amt')}
                  className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(180deg,var(--color-surface-2),var(--color-surface-1))] border border-[var(--color-hair-2)] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)] p-6 md:p-7 transition-all duration-500 ease-silk hover:border-[var(--color-hair-3)] hover:bg-[var(--color-surface-2)] hover:-translate-y-[2px] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_30px_60px_-24px_rgba(0,0,0,0.7)] group/card cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-80"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -left-24 w-[360px] h-[360px] rounded-full blur-[120px] opacity-[0.15] bg-[var(--color-brand-red)]"
                  />
                  <div className="relative z-[1]">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 uppercase font-semibold font-mono h-5 px-2 text-[10px] rounded-[6px] tracking-[0.14em] text-[var(--color-brand-red-soft)] bg-[var(--color-brand-red-tint)] border border-[var(--color-brand-red)]/25 mb-2.5">
                          Foundation
                        </span>
                        <h3 className="font-display font-bold text-[var(--color-ink-1)] text-[19px] tracking-[-0.02em] mb-1">
                          Auction Market Theory
                        </h3>
                        <p className="text-[12.5px] text-[var(--color-ink-3)]">
                          The lens through which everything makes sense.
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-[var(--color-ink-4)] group-hover/card:text-[var(--color-brand-red)] group-hover/card:translate-x-0.5 transition-all mt-1 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 6 Core Modules 2-column Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { slug: 'volume-profile', title: 'Volume Profile', desc: 'Value areas' },
                    { slug: 'tpo', title: 'TPO', desc: 'Time at price' },
                    { slug: 'footprint', title: 'Footprint', desc: 'Inside the candle' },
                    { slug: 'dom', title: 'DOM', desc: 'Order book' },
                    { slug: 'vwap', title: 'VWAP', desc: 'Fair value anchor' },
                    { slug: 'heatmap', title: 'Heatmap', desc: 'Liquidity map' }
                  ].map((item) => (
                    <div
                      key={item.slug}
                      onClick={() => handleSelectLesson(item.slug)}
                      className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-5 transition-all duration-500 ease-silk hover:border-[var(--color-hair-3)] hover:bg-[var(--color-surface-2)] hover:-translate-y-[2px] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_30px_60px_-24px_rgba(0,0,0,0.7)] group/card cursor-pointer h-full"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-80"
                      />
                      <div className="relative z-[1]">
                        <h3 className="font-semibold text-[var(--color-ink-1)] text-[13.5px] mb-1 group-hover/card:text-white transition-colors tracking-[-0.01em]">
                          {item.title}
                        </h3>
                        <p className="text-[11.5px] text-[var(--color-ink-3)]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Header Column (Order 1 on mobile, Order 2 on md) */}
            <div className="pl-14 md:pl-16 order-1 md:order-2">
              <div>
                <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-red-soft)] mb-4">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-brand-red)]" />
                  Phase 02
                </span>
                <h2 className="font-display text-[1.8rem] md:text-[2.25rem] font-bold tracking-[-0.035em] mb-3 text-[var(--color-brand-red)]">
                  Core Knowledge
                </h2>
                <p className="text-[var(--color-ink-3)] text-[14px] leading-relaxed mb-5 max-w-sm">
                  The mechanics of the auction. Seven modules, start with AMT.
                </p>
                <div className="flex items-center gap-3 text-[11.5px] text-[var(--color-ink-3)]">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-red)]" />
                    7 modules
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PHASE 03: PSYCHOLOGY & EDGE (Blue dot, Header left, Steps right) */}
          {/* ========================================================= */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-32">
            {/* Timeline Dot */}
            <div className="absolute left-[20px] md:left-1/2 top-1 md:top-4 w-[16px] h-[16px] rounded-full border-2 border-[var(--color-brand-blue)] bg-[var(--color-surface-0)] md:-translate-x-1/2 z-10">
              <div className="absolute inset-1 rounded-full bg-[var(--color-brand-blue)]" />
            </div>

            {/* Left Header Column */}
            <div className="pl-14 md:pl-0 md:pr-16">
              <div className="md:text-right">
                <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-blue-soft)] mb-4">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-brand-blue)]" />
                  Phase 03
                </span>
                <h2 className="font-display text-[1.8rem] md:text-[2.25rem] font-bold tracking-[-0.035em] mb-3 text-[var(--color-brand-blue)]">
                  Psychology &amp; Edge
                </h2>
                <p className="text-[var(--color-ink-3)] text-[14px] leading-relaxed mb-5 max-w-sm md:ml-auto">
                  Your edge is fragile. Your mind protects it.
                </p>
              </div>
            </div>

            {/* Right 5 Steps Column */}
            <div className="pl-14 md:pl-16">
              <div className="space-y-2">
                {[
                  {
                    num: '01',
                    title: 'Bias',
                    desc: 'Know the direction before the session starts'
                  },
                  {
                    num: '02',
                    title: 'Location',
                    desc: 'Wait for price at structural areas'
                  },
                  {
                    num: '03',
                    title: 'Execution',
                    desc: 'Confirm with orderflow at your level'
                  },
                  {
                    num: '04',
                    title: 'Risk Management',
                    desc: 'Define stop and size before entry'
                  },
                  {
                    num: '05',
                    title: 'Profit Management',
                    desc: 'Plan exits before you enter'
                  }
                ].map((step) => (
                  <div key={step.num} className="h-full">
                    <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-5 hover:border-[var(--color-hair-3)] transition-colors">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-80"
                      />
                      <div className="relative z-[1]">
                        <div className="flex gap-4">
                          <span className="font-mono text-[10.5px] font-semibold text-[var(--color-ink-4)] mt-0.5 shrink-0 tabular-nums">
                            {step.num}
                          </span>
                          <div>
                            <span className="text-[13.5px] font-semibold text-[var(--color-ink-1)] tracking-[-0.005em]">
                              {step.title}
                            </span>
                            <p className="text-[12px] text-[var(--color-ink-3)] leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bottom Links to Psychology and Edge */}
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => handleSelectLesson('psychology')}
                    className="inline-flex items-center gap-2 text-[var(--color-ink-2)] text-[12.5px] font-semibold hover:text-white hover:gap-3 transition-all cursor-pointer"
                  >
                    <span>Psychology</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleSelectLesson('edge')}
                    className="inline-flex items-center gap-2 text-[var(--color-ink-2)] text-[12.5px] font-semibold hover:text-white hover:gap-3 transition-all cursor-pointer"
                  >
                    <span>Edge</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PHASE 04: TRADING MODELS (Red dot, Cards left, Header right) */}
          {/* ========================================================= */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20">
            {/* Timeline Dot */}
            <div className="absolute left-[20px] md:left-1/2 top-1 md:top-4 w-[16px] h-[16px] rounded-full border-2 border-[var(--color-brand-red)] bg-[var(--color-surface-0)] md:-translate-x-1/2 z-10">
              <div className="absolute inset-1 rounded-full bg-[var(--color-brand-red)]" />
            </div>

            {/* Left 4 Models List (Order 2 on mobile, Order 1 on md) */}
            <div className="pl-14 md:pl-0 md:pr-16 order-2 md:order-1">
              <div className="space-y-3">
                {[
                  {
                    slug: 'vld',
                    title: 'VLD',
                    desc: 'Value Level Deviation'
                  },
                  {
                    slug: '1vw',
                    title: '1VW',
                    desc: 'One VWAP Wide'
                  },
                  {
                    slug: 'os9',
                    title: 'OS9',
                    desc: 'Overlapping Setup'
                  },
                  {
                    slug: 'onvp',
                    title: 'ONVP',
                    desc: 'Overnight Volume Profile'
                  }
                ].map((model) => (
                  <div
                    key={model.slug}
                    onClick={() => handleSelectLesson(model.slug)}
                    className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-5 transition-all duration-500 ease-silk hover:border-[var(--color-hair-3)] hover:bg-[var(--color-surface-2)] hover:-translate-y-[2px] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_30px_60px_-24px_rgba(0,0,0,0.7)] group/card cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-80"
                    />
                    <div className="relative z-[1]">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-[var(--color-ink-1)] text-[15px] tracking-[-0.015em] group-hover/card:text-white transition-colors">
                            {model.title}
                          </h3>
                          <p className="text-[12px] text-[var(--color-ink-3)]">{model.desc}</p>
                        </div>
                        <svg
                          className="w-4 h-4 text-[var(--color-ink-4)] group-hover/card:text-[var(--color-ink-1)] group-hover/card:translate-x-0.5 transition-all shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Header Column (Order 1 on mobile, Order 2 on md) */}
            <div className="pl-14 md:pl-16 order-1 md:order-2">
              <div>
                <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-red-soft)] mb-4">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-brand-red)]" />
                  Phase 04
                </span>
                <h2 className="font-display text-[1.8rem] md:text-[2.25rem] font-bold tracking-[-0.035em] mb-3 text-[var(--color-brand-red)]">
                  Trading Models
                </h2>
                <p className="text-[var(--color-ink-3)] text-[14px] leading-relaxed mb-5 max-w-sm">
                  Context + Trigger = Execution. Four proven setups.
                </p>
                <div className="flex items-center gap-3 text-[11.5px] text-[var(--color-ink-3)]">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-red)]" />
                    4 models
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
