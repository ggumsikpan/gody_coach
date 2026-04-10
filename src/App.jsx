import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import './index.css'

const B = import.meta.env.BASE_URL

/* ── 하트 파티클 ── */
function HeartTrail() {
  const [hearts, setHearts] = useState([])
  const throttle = useRef(false)
  const HEARTS = ['❤️', '🧡', '💛', '💗', '💕', '♥️']

  const handleMove = useCallback((e) => {
    if (throttle.current) return
    throttle.current = true
    setTimeout(() => { throttle.current = false }, 80)

    const id = Date.now() + Math.random()
    const x = e.clientX + (Math.random() - 0.5) * 20
    const y = e.clientY + (Math.random() - 0.5) * 20
    const emoji = HEARTS[Math.floor(Math.random() * HEARTS.length)]
    const size = 10 + Math.random() * 14

    setHearts(prev => [...prev.slice(-15), { id, x, y, emoji, size }])
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMove])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div
            key={h.id}
            className="absolute select-none"
            style={{ left: h.x, top: h.y, fontSize: h.size }}
            initial={{ opacity: 0.8, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, y: -60, x: (Math.random() - 0.5) * 40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onAnimationComplete={() => setHearts(prev => prev.filter(p => p.id !== h.id))}
          >
            {h.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ── 애니메이션 ── */
function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  )
}

function Counter({ end, suffix = '', label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const step = Math.ceil(end / 40)
    const t = setInterval(() => {
      cur += step
      if (cur >= end) { setCount(end); clearInterval(t) } else setCount(cur)
    }, 30)
    return () => clearInterval(t)
  }, [inView, end])
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-coral">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm text-brown/50 mt-1">{label}</div>
    </div>
  )
}

/* ── 이미지 shorthand ── */
const I = (name) => `${B}images/${name}`
const F = (name) => `${B}images/family/${name}`

/* 핵심 이미지 매핑 */
const IMG = {
  profile: I('621267515_17937359925120427_1158600056412707833_n.webp'),       // 고디 일러스트 (글쓰기)
  mentoring: I('lecture.webp'),                                               // 강의 포스터
  timeline: I('655955265_17952366921120427_1877412602112986925_n.jpg'),        // 감사일기 쓴 과정
  group: I('610748139_17935150461120427_7228801200663153768_n.jpg'),           // 단체사진
  family_illust: I('gratitude_diary.webp'),                                   // 감사일기 노트
  docs: I('pink_penguin.webp'),                                              // 핑크펭귄 멘토링
  f1: F('631749154_17941321215120427_7437124942664758773_n.webp'),              // 1. 가족 일러스트 5인
  f2: F('626301929_17939837463120427_3688425304496304401_n.webp'),             // 2. 부부 우산 일러스트
  f3: F('630076078_17939653602120427_4049854931979552730_n.webp'),             // 3. 부부 카페 일러스트
  f4: F('605917987_17933486613120427_4495583861024269654_n.webp'),             // 4. 가멋남 발표 (TV)
  f5: F('606982628_17933466834120427_6833634272806439108_n.webp'),             // 5. 부부 시상
  f6: F('611245205_17934137169120427_4618591513892175457_n.webp'),             // 6. 가족독서 발표회 단체
  f7: F('658863064_17951810661120427_452515117720983543_n.webp'),              // 7. 가족 4인 유리창
  f8: F('658952296_17951810649120427_5623064041194467940_n.webp'),             // 8. 가족 제주 유채꽃
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream text-brown font-[var(--font-family-pretendard)]">
      <HeartTrail />

      {/* ━━━━━━ HEADER ━━━━━━ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-brown/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-coral font-extrabold text-sm sm:text-base">지혜실천가 | 고마워디자이너 | 최덕분</span>
          </div>
          <a href="https://naver.me/5k73pcML" target="_blank" rel="noopener noreferrer"
            className="bg-coral hover:bg-coral-deep text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
            고디 블로그 보기
          </a>
        </div>
      </header>

      {/* ━━━━━━ HERO ━━━━━━ */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-b from-peach via-warm to-cream overflow-hidden pt-14">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 right-10 w-96 h-96 bg-coral rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-soft rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-20 text-center">
          <FadeIn>
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-coral/20 shadow-xl">
              <img src={IMG.profile} alt="고디" className="w-full h-full object-cover" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-coral/10 border border-coral/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              <span className="text-coral text-sm font-medium">세바시 2회 출연 | 감사일기 11년차</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-brown leading-tight mb-6">
              700일 감사일기를 썼는데<br />
              <span className="text-coral">왜 이혼 통보를 받았을까?</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg text-brown/60 max-w-2xl mx-auto mb-4 leading-relaxed">
              40대 중반, 삶이 가장 흔들리던 혼돈의 시기.<br />
              부부관계는 벼랑 끝에 있었고, 두 번째 이혼 통보 앞에서 무너졌습니다.
            </p>
            <p className="text-sm sm:text-base text-coral/80 font-semibold max-w-xl mx-auto mb-10">
              그 순간, 도망이 아닌 선택을 했습니다.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <a href="#story" className="group inline-block bg-coral hover:bg-coral-deep text-white font-bold text-base sm:text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
              그 선택이 궁금하다면
              <span className="inline-block ml-2 transition-transform group-hover:translate-y-0.5">&darr;</span>
            </a>
          </FadeIn>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <svg className="w-6 h-6 text-coral/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </motion.div>
      </section>

      {/* ━━━━━━ STORY (핵심 서사) ━━━━━━ */}
      <section id="story" className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <FadeIn>
            <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">The Choice</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brown text-center mb-16">
              43일간 아무 반응이 없었습니다.<br />
              <span className="text-coral">그래도 멈추지 않았습니다.</span>
            </h2>
          </FadeIn>

          <div className="space-y-12">
            {[
              { phase: '혼돈', emoji: '🌊', title: '700일의 감사일기, 그런데 이혼 통보', desc: '감사일기를 700일이나 썼는데, 부부관계는 벼랑 끝이었습니다. 서로에 대한 불만과 무시가 쌓여 두 번째 이혼 통보를 받았습니다.' },
              { phase: '선택', emoji: '✉️', title: '남편에게 100일 고마워 편지를 쓰기로', desc: '도망 대신 선택했습니다. 매일 남편에게 "고마워" 편지를 쓰기로. 43일째까지 아무런 반응도 없었습니다. 그래도 멈추지 않았습니다.', img: `${B}images/letter.webp` },
              { phase: '변화', emoji: '🌱', title: '닫혀있던 마음의 문이 열리기 시작', desc: '어느 날부터 조금씩, 닫혀있던 마음의 문이 열리며 관계가 회복되어 갔습니다. 진정한 감사는 감정을 누르는 게 아니라, 감정을 안아준 뒤 시작되는 것이었습니다.' },
              { phase: '지금', emoji: '☀️', title: '감사가 삶이 된 11년, 고마워컴퍼니 대표', desc: '46세에 시작한 감사일기가 3,142일이 되었습니다. 50세에 고마워디자이너, 52세에 고마워컴퍼니. 포기하지 않고 감사일기를 계속 쓴 것, 그것이 지금의 저를 만들었습니다.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-2xl">{item.emoji}</div>
                    {i < 3 && <div className="w-px flex-1 bg-coral/10 mt-2" />}
                  </div>
                  <div className="pb-2 flex-1">
                    <span className="text-coral text-xs font-bold tracking-widest">{item.phase}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-brown mt-1 mb-2">{item.title}</h3>
                    <p className="text-brown/60 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                    {item.img && (
                      <div className="mt-4 rounded-xl overflow-hidden shadow-md border border-coral/10 max-w-sm">
                        <img src={item.img} alt="고마워 편지" className="w-full" />
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ 숫자 ━━━━━━ */}
      <section className="py-16 bg-brown">
        <div className="max-w-4xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { end: 3142, suffix: '일', label: '감사일기 연속 기록' },
              { end: 2, suffix: '회', label: '세바시 출연' },
              { end: 11, suffix: '년', label: '감사 실천' },
              { end: 48, suffix: '회', label: '핑크펭귄 반복 독서' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-coral">
                  <Counter end={s.end} suffix={s.suffix} label="" />
                </div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ 감사일기 타임라인 ━━━━━━ */}
      <section className="py-20 md:py-28 bg-peach">
        <div className="max-w-4xl mx-auto px-5">
          <FadeIn>
            <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">Journey</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brown text-center mb-4">
              46세에 시작한 감사일기,<br /><span className="text-coral">11년의 여정</span>
            </h2>
            <p className="text-center text-brown/50 mb-14 max-w-lg mx-auto">포기하지 않고 쓴 그 시간이 지금의 저를 만들었습니다.</p>
          </FadeIn>

          <FadeIn>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-10">
              <img src={IMG.timeline} alt="감사일기 쓴 과정 타임라인" className="w-full" />
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { year: '2015', event: '감사일기 시작', age: '46세' },
              { year: '2018', event: '1,000일 달성', age: '49세' },
              { year: '2019', event: 'W사 퇴직, 새 시작', age: '50세' },
              { year: '2026', event: '3,142일+\n고마워컴퍼니 대표', age: '57세' },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-brown/5">
                  <p className="text-coral font-extrabold text-2xl">{t.year}</p>
                  <p className="text-brown font-bold text-sm mt-1 whitespace-pre-line">{t.event}</p>
                  <p className="text-brown/40 text-xs mt-1">{t.age}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ 또 하나의 100일 (나에게 편지) ━━━━━━ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <FadeIn>
            <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">Hidden Story</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brown text-center mb-6">
              아무도 몰랐던<br /><span className="text-coral">나에게 쓴 100일 편지</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-peach rounded-2xl p-6 md:p-10 border border-coral/10">
              <div className="text-brown/70 text-sm sm:text-base leading-relaxed space-y-4">
                <p>남편 몰래 1억을 빚지고, 내 자신이 미웠고 싫었습니다.</p>
                <p>정말 억울하고 힘들었지만, 아무도 나를 위로해주지 않았습니다.</p>
                <p>밑바닥까지 내려간 나를 어떻게든 살리고 싶어 간절했습니다.</p>
                <p className="font-bold text-brown text-base sm:text-lg">
                  그래서 100일 동안 <span className="text-coral">나에게 "고마워" 편지</span>를 써주었습니다.
                </p>
                <p>그 시간 끝에 알게 되었습니다.</p>
                <p className="text-lg sm:text-xl font-extrabold text-coral text-center py-4">
                  "이 세상에서 가장 소중한 존재도,<br />
                  가장 고마운 존재도 바로 '나'라는 걸."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━━━━ 서비스 (도움) ━━━━━━ */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-5xl mx-auto px-5">
          <FadeIn>
            <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">What I Do</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brown text-center mb-4">
              고디가 <span className="text-coral">도울 수 있는 것</span>
            </h2>
            <p className="text-center text-brown/50 max-w-lg mx-auto mb-14">
              "대단한 전문가가 아니라, 먼저 7년을 걸어온 사람입니다."
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: '✍️', title: '감사리더십 강의',
                desc: '기업과 조직을 위한 감사 소통 프로그램. 세바시 2회 출연, 6년간 갈고닦은 교재와 강의안으로 진심을 전합니다.',
                tags: ['기업 강의', '조직 소통', '감사 문화'],
                img: IMG.mentoring,
              },
              {
                emoji: '🌱', title: '꿈이나 1:1 멘토링',
                desc: '스레드 방향성, 브랜딩, 삶의 방향을 함께 찾아갑니다. 핑크펭귄 책을 활용한 맞춤 컨설팅.',
                tags: ['브랜딩', '방향성', '정체성'],
                img: IMG.docs,
              },
              {
                emoji: '💕', title: '관계 회복 코칭',
                desc: '이혼 위기를 극복한 실제 경험을 바탕으로 부부/가족 관계 회복을 돕습니다.',
                tags: ['부부 관계', '가족 소통', '감사 편지'],
                img: IMG.family_illust,
              },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md border border-brown/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="h-44 overflow-hidden relative">
                    <img src={card.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown/40 to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-2xl mb-2">{card.emoji}</div>
                    <h3 className="text-lg font-bold text-brown mb-3">{card.title}</h3>
                    <p className="text-brown/60 text-sm leading-relaxed mb-4 flex-1">{card.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, j) => (
                        <span key={j} className="text-xs bg-coral/10 text-coral border border-coral/20 rounded-full px-3 py-1">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ 멘토링 후기 ━━━━━━ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <FadeIn>
            <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">Voices</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brown text-center mb-14">
              고디를 만난 사람들의 <span className="text-coral">한마디</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { name: '시크릿마마', role: '한나식빵 송파점 대표', text: '코칭보다 먼저 "사람"을 만났다. 고디쌤 부부의 존중하는 태도가 내 인생의 방향을 다시 세웠다.' },
              { name: '웨인', role: '웨인컴퍼니 대표', text: '오랜만에 내 이야기를 할 수 있었다. 나 자신과 마주하는 시간은 다시 성장할 수 있다는 확신을 준다.' },
              { name: '아마토르', role: '라이프코치', text: '동네 누나 고디님 만나고 왔어. "받는 기회가 있음을 고맙게 여기는 사람 되기" - 귀한 깨달음이야.' },
              { name: '꿈식맨', role: '시스템 컨설턴트', text: '5시간 넘도록 7년의 경험을 가치로 나눠주셨다. 방향성과 목적성이 없는 실행이 얼마나 힘든지 알기에 간절히 전해주신 시간.' },
              { name: '라라', role: '스레드 멤버', text: '서울역에서 5시간을 기다려 만나주셨다. 따뜻한 한마디 "고마워"가 작은 기적이 되길 기도하며 응원해주셨다.' },
              { name: '단아', role: '일상 큐레이터', text: '가장 추운 날 안양에서 갔는데, 7년차 경험과 기록을 나누며 앞으로의 방향성을 함께 잡아주셨어요.' },
            ].map((v, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-peach/50 rounded-2xl p-5 border border-coral/5">
                  <p className="text-brown/70 text-sm leading-relaxed mb-4">"{v.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-coral/15 flex items-center justify-center text-coral font-bold text-xs">{v.name[0]}</div>
                    <div>
                      <p className="text-brown font-bold text-sm">{v.name}</p>
                      <p className="text-brown/40 text-xs">{v.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ 만남 캐러셀 ━━━━━━ */}
      <section className="py-12 bg-cream overflow-hidden">
        <FadeIn>
          <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">Connections</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brown text-center mb-8">
            고디를 만난 <span className="text-coral">따뜻한 순간들</span>
          </h2>
        </FadeIn>
        {(() => {
          const PEOPLE = [
            '670774875_17952699786120427_2798390370475125361_n.webp',
            '576122854_17928387036120427_3518527098537720814_n.webp',
            '585864882_17929194666120427_1587687432389029715_n.webp',
            '589842319_17934934488120427_7841180664141857726_n.jpg',
            '591149430_17930431749120427_1457911759718292691_n.webp',
            '591165221_17930993643120427_4303427703975472482_n.webp',
            '602349078_17932559853120427_9187523041995478616_n.webp',
            '604232581_17932559874120427_7043911489295609441_n.webp',
            '608826534_17933691555120427_3788803990942291_n.webp',
            '615387520_17935505529120427_2905986761154887756_n.webp',
            '615927568_17935373967120427_5710623532649275851_n.webp',
            '616008438_17935692471120427_8963250065464303490_n.webp',
            '616606147_17935595655120427_5086319584271407352_n.webp',
            '617108051_17935692420120427_2970732349831499829_n.webp',
            '621439285_17936847282120427_7618758626256255538_n.webp',
            '621681506_17936994891120427_1524954944991549302_n.webp',
            '621808409_17936941908120427_8395706318316080208_n.webp',
            '622572685_17937666870120427_8438263965561589324_n.webp',
            '625632633_17938929594120427_3436209314009429547_n.webp',
            '628272276_17939306181120427_7162006648806852424_n.webp',
            '629217522_17939129523120427_7219815216839445007_n.webp',
            '632477619_17940002916120427_6241562939872697993_n.webp',
            '640356113_17943472398120427_8890311830385377399_n.webp',
            '640418972_17943940890120427_7517112464131876106_n.webp',
            '643733982_17944505856120427_1457825128167569537_n.jpg',
            '649228248_17946639849120112_4884412314898130719_n.webp',
            '649228725_17946639852120112_6781636476145087361_n.webp',
            '649231270_17945572791120427_6779638507155372427_n.webp',
            '652041983_17946928170120427_5474771324274010476_n.webp',
            '652080838_17947076691120427_8322679435984710247_n.webp',
            '653400598_17947652187120427_6996024128545982575_n.webp',
            '655125682_17947904676120427_2953277670796475106_n.webp',
            '669757909_17952699855120427_7477514611302073163_n.webp',
          ]
          const doubled = [...PEOPLE, ...PEOPLE]
          return (
            <div className="relative">
              <motion.div
                className="flex gap-3"
                animate={{ x: [0, -(PEOPLE.length * 164)] }}
                transition={{ duration: PEOPLE.length * 3, repeat: Infinity, ease: 'linear' }}
              >
                {doubled.map((p, i) => (
                  <div key={i} className="flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden shadow-md">
                    <img src={`${B}images/people/${p}`} alt="고디를 만난 사람" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </motion.div>
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent pointer-events-none" />
            </div>
          )
        })()}
      </section>

      {/* ━━━━━━ 철학 (필사의 힘) ━━━━━━ */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-brown to-brown/90 text-white">
        <div className="max-w-3xl mx-auto px-5">
          <FadeIn>
            <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">Philosophy</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-14">
              고디의 <span className="text-coral">삶의 문장들</span>
            </h2>
          </FadeIn>

          <div className="space-y-6">
            {[
              '감사는 나를 가장 먼저 살리는 힘이다.',
              '내 마음의 치유는 나의 몫이다. 가장 따뜻한 언어로 포근하게 안아줘야 한다.',
              '누군가 걷고 싶은 길을 만든다는 생각으로 살아라.',
              '글이 될 수 있는 삶을 살아라. 좋은 글을 쓰기 위해서는 먼저 좋은 삶을 살아야 한다.',
              '나는 나에게 다정한 사람이며, 어떤 비난에도 흔들리지 않는 단단한 내면을 가진 사람이다.',
            ].map((q, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed italic">"{q}"</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ 다손가족 ━━━━━━ */}
      <section className="py-20 md:py-28 bg-peach">
        <div className="max-w-5xl mx-auto px-5">
          <FadeIn>
            <p className="text-coral font-semibold text-sm tracking-widest uppercase mb-3 text-center">Family</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brown text-center mb-4">
              사랑하는 <span className="text-coral">다손가족</span>
            </h2>
            <p className="text-center text-brown/50 max-w-lg mx-auto mb-14">
              "부부가 삼남매에게 남기는 유산은 돈이 아니라 가족문화입니다."
            </p>
          </FadeIn>

          {/* 가족 사진 갤러리 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[IMG.f1, IMG.f2, IMG.f3, IMG.f4, IMG.f5, IMG.f6, IMG.f7, IMG.f8].map((src, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img src={src} alt="다손가족" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              </FadeIn>
            ))}
          </div>

          {/* 가족 독서 발표회 */}
          <FadeIn>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-brown/5">
              <h3 className="text-lg font-bold text-brown mb-4">매년 12월, 가족독서 발표회</h3>
              <div className="text-brown/60 text-sm leading-relaxed space-y-3">
                <p>부부 각자가 큰 수술을 하며 깨달았습니다. <strong className="text-brown">"누구나 언제든 죽음을 맞이한다."</strong></p>
                <p>그래서 우리 부부가 없어도 삼남매에겐 살아갈 힘이 필요했습니다.</p>
                <p>돈이 아니라 <strong className="text-coral">가족문화를 유산</strong>으로 남기기로 했습니다.</p>
                <p>책은 핑계였고, 발표는 도구였고, 진짜 목적은 <strong className="text-brown">삶을 함께 이야기하며 서로 소통하는 가족</strong>이 되는 것이었습니다.</p>
              </div>
              <div className="mt-6 p-4 bg-coral/5 rounded-xl text-center">
                <p className="text-coral font-bold text-sm">고마워요 사랑해요 덕분에요 행복해요</p>
                <p className="text-brown/40 text-xs mt-1">고사덕행 - 다손가족의 약속</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━━━━ CTA ━━━━━━ */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-coral to-coral-deep text-white">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <FadeIn>
            <div className="text-5xl mb-6">💌</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
              감사가 삶이 되는 순간,<br />함께 걸어가겠습니다.
            </h2>
            <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed">
              감사일기가 궁금하시든, 관계를 회복하고 싶으시든,<br />
              브랜딩의 방향을 찾고 싶으시든.<br />
              고디의 블로그에서 더 많은 이야기를 만나보세요.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <a href="https://naver.me/5k73pcML" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-white text-coral font-bold text-base sm:text-lg px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl">
              고디 블로그 방문하기 &rarr;
            </a>
            <div className="flex justify-center gap-6 mt-8">
              <a href="https://www.threads.net/@gody_coach" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors text-sm">Threads</a>
              <a href="https://m.blog.naver.com/yscys5069" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors text-sm">Blog</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━━━━ FOOTER ━━━━━━ */}
      <footer className="bg-brown py-8">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="text-coral font-bold text-lg mb-1">고마워디자이너 고디</p>
          <p className="text-white/40 text-sm mb-2">지혜실천가 | 최덕분 | @gody_coach</p>
          <a href="https://naver.me/FkLH0dnE" target="_blank" rel="noopener noreferrer" className="text-white/30 text-xs mb-4 inline-block hover:text-white/50 transition-colors">고마워컴퍼니 | 경기도 화성시 동탄 📍</a>
          <div className="border-t border-white/5 pt-4">
            <p className="text-white/40 text-xs">&copy; 2026 고마워컴퍼니. All rights reserved.</p>
            <p className="text-white/30 text-xs mt-1">랜딩페이지 제작 &middot; <a href="https://ggumsikpan.github.io/ggumsikman" target="_blank" className="text-white/30 hover:text-white/50 no-underline">꿈식판 꿈식맨</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
