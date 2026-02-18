import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import allQuestions from './data/questions';
import './index.css';

/* Utility: pick N random questions from pool */
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/* ============================
   Background Orbs
   ============================ */
function BgOrbs() {
  return (
    <div className="bg-orbs">
      <div className="orb" />
      <div className="orb" />
      <div className="orb" />
    </div>
  );
}

/* ============================
   Disclaimer Page
   ============================ */
function Disclaimer({ onBack }) {
  return (
    <div className="disclaimer" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      <button className="back-btn" onClick={onBack}>← トップに戻る</button>

      <div className="disclaimer-card">
        <h2 className="disclaimer-title">⚠️ 対策問題の利用にあたって</h2>
        <p className="disclaimer-lead">
          この問題集は、学習の補助として<strong>生成AIを用いて作成されたもの</strong>です。<br />
          活用する際は、以下の注意事項を必ず読み、<strong>批判的な視点</strong>を持って取り組んでください。
        </p>

        <div className="disclaimer-section">
          <div className="disclaimer-section-header">
            <span className="disclaimer-num">1</span>
            <h3>「ハルシネーション（もっともらしい嘘）」への注意</h3>
          </div>
          <ul>
            <li>生成AIは、時として事実とは異なる情報を、あたかも正しいかのように出力する「ハルシネーション」を起こすことがあります。</li>
            <li><strong>解答や解説が100%正確である保証はありません。</strong>疑問に思った点や、自分の理解と異なる箇所は、必ず教科書（703高校情ⅠP）・授業プリントの該当ページを確認し、正確な知識を補完してください。</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <div className="disclaimer-section-header">
            <span className="disclaimer-num">2</span>
            <h3>試験範囲外の問題が含まれる可能性</h3>
          </div>
          <ul>
            <li>この問題集は提供された資料に基づいて作成されていますが、AIの判断により、授業で扱っていない内容や、試験範囲外の高度な知識が含まれている可能性があります。</li>
            <li>実際の3学期期末試験の範囲には、<strong>「課題のフォームの内容」</strong>も含まれます。AIが作成した問題だけに頼るのではなく、授業課題やフォームの復習も並行して行ってください。</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <div className="disclaimer-section-header">
            <span className="disclaimer-num">3</span>
            <h3>用語と定義の再確認</h3>
          </div>
          <ul>
            <li>試験問題の用語は、原則として授業プリントや教科書に準じています。AIが使用している用語が、授業での説明と微妙に異なる場合があるため、<strong>教科書の定義を優先して覚えてください</strong>。</li>
            <li>特に、データ・情報・知識の分類や情報の特性（残存性、複製性、伝播性など）は、資料によって定義が細かく分かれる場合があるため、<strong>教科書 p.4-5 の記述を最終的な基準</strong>としてください。</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <div className="disclaimer-section-header">
            <span className="disclaimer-num">4</span>
            <h3>情報の信憑性を判断する力の養成（メディアリテラシー）</h3>
          </div>
          <ul>
            <li>資料にもある通り、インターネット上の情報やAIの生成物には、意図的なフェイクや不正確な内容が含まれる可能性があることを認識してください。</li>
            <li>この問題集を解くこと自体を、<strong>「情報の信憑性をクロスチェック（複数の情報源で確認）する」</strong>ためのトレーニングとして活用してください。</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <div className="disclaimer-section-header">
            <span className="disclaimer-num">5</span>
            <h3>著作権への配慮</h3>
          </div>
          <ul>
            <li>生成AIが作成した内容であっても、既存の著作物に類似している場合、著作権を侵害するおそれがあることに留意してください。この問題集を<strong>SNS等へ無断で転載・公開することは控えてください</strong>。</li>
          </ul>
        </div>

        <div className="disclaimer-advice">
          <div className="disclaimer-advice-icon">💡</div>
          <div>
            <h4>学習のアドバイス</h4>
            <p>実際の試験では、<strong>1学期分から12問、2学期分から13問、3学期分から25問</strong>が出題される予定です。この問題集で自分の苦手な分野を特定したら、その周辺の教科書の内容を読み込むことで、より確実な対策が可能になります。</p>
          </div>
        </div>
      </div>

      <button className="back-btn bottom" onClick={onBack}>← トップに戻る</button>
    </div>
  );
}

/* ============================
   Intro Screen
   ============================ */
function Intro({ onStartRandom, onStartSequential, onShowDisclaimer }) {
  const [seqStart, setSeqStart] = useState(1);

  return (
    <div className="intro">
      <div className="logo-icon">🚀</div>
      <h1>理数情報<br />３学期期末テスト対策</h1>
      <p className="subtitle">全50問の中からチャレンジしよう！</p>

      {/* Disclaimer banner - positioned between title and modes */}
      <div className="disclaimer-banner" onClick={onShowDisclaimer}>
        <div className="disclaimer-banner-icon">⚠️</div>
        <div className="disclaimer-banner-text">
          <strong>はじめに必ずお読みください</strong>
          <span>この問題集はAIで作成されています。利用上の注意事項を確認してから始めましょう。</span>
        </div>
        <div className="disclaimer-banner-arrow">→</div>
      </div>

      {/* Mode selection cards */}
      <div className="mode-cards">
        {/* Random 10 mode */}
        <div className="mode-card">
          <div className="mode-card-header">
            <span className="mode-icon">🎲</span>
            <h3>ランダム10問</h3>
          </div>
          <p className="mode-desc">50問の中からランダムで10問を出題。サクッと復習したい時に！</p>
          <div className="mode-meta">
            <span>📚 10問</span>
            <span>⏱ 約5分</span>
          </div>
          <button className="start-btn" onClick={onStartRandom}>
            チャレンジ開始 ⚡
          </button>
        </div>

        {/* Sequential 50 mode */}
        <div className="mode-card">
          <div className="mode-card-header">
            <span className="mode-icon">📖</span>
            <h3>全問チャレンジ</h3>
          </div>
          <p className="mode-desc">50問を順番に全部解く！しっかり対策したい時に。途中からも開始できます。</p>
          <div className="mode-meta">
            <span>📚 50問</span>
            <span>⏱ 約25分</span>
          </div>
          <div className="seq-start-picker">
            <label htmlFor="seq-start">開始問題番号：</label>
            <select
              id="seq-start"
              value={seqStart}
              onChange={(e) => setSeqStart(Number(e.target.value))}
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>第{n}問から</option>
              ))}
            </select>
          </div>
          <button className="start-btn sequential" onClick={() => onStartSequential(seqStart)}>
            スタート 📝
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Quiz Screen
   ============================ */
function Quiz({ questions, onFinish, startNumber }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);   // track all answers

  const total = questions.length;
  const q = questions[currentIdx];
  const isCorrect = selected === q.answer;
  const choiceLabels = ['A', 'B', 'C', 'D'];

  // scroll to top when question changes
  const quizRef = useRef(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIdx]);

  const handleSelect = (choiceIdx) => {
    if (answered) return;
    setSelected(choiceIdx);
    setAnswered(true);

    const correct = choiceIdx === q.answer;
    if (correct) {
      setScore((s) => s + 1);
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#22d3ee', '#34d399', '#a78bfa'],
        disableForReducedMotion: true,
      });
    }

    setAnswers((prev) => [
      ...prev,
      {
        question: q,
        selected: choiceIdx,
        correct,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      onFinish(score, answers);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const progressPct = ((currentIdx + (answered ? 1 : 0)) / total) * 100;
  const displayNum = startNumber ? startNumber + currentIdx : currentIdx + 1;

  return (
    <div className="quiz" ref={quizRef} key={currentIdx}>
      {/* Header */}
      <div className="quiz-header">
        <div className="question-counter">
          Q <span>{currentIdx + 1}</span> / {total}
        </div>
        <div className="score-badge">
          ✅ <span className="score-val">{score}</span> 正解
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question */}
      <div className="question-card">
        <div className="question-number-badge">📖 問題 {displayNum}</div>
        <p className="question-text">{q.question}</p>
      </div>

      {/* Choices */}
      <div className="choices-list">
        {q.choices.map((choice, idx) => {
          const oneBasedIdx = idx + 1;
          let stateClass = '';
          if (answered) {
            if (oneBasedIdx === q.answer) stateClass = 'correct';
            else if (oneBasedIdx === selected) stateClass = 'incorrect';
          }
          return (
            <button
              key={idx}
              className={`choice-btn ${stateClass}`}
              onClick={() => handleSelect(oneBasedIdx)}
              disabled={answered}
            >
              <span className="choice-label">{choiceLabels[idx]}</span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            <span className="feedback-icon">{isCorrect ? '🎉' : '💡'}</span>
            <span className="feedback-title">
              {isCorrect ? '正解！すばらしい！' : '残念！不正解…'}
            </span>
          </div>
          <p className="feedback-explanation">{q.explanation}</p>
          <p className="feedback-page">📖 教科書 {q.page}</p>
        </div>
      )}

      {/* Next Button */}
      {answered && (
        <button className="next-btn" onClick={handleNext}>
          {currentIdx + 1 >= total ? '結果を見る 🏆' : '次の問題へ →'}
        </button>
      )}
    </div>
  );
}

/* ============================
   Review List Component
   ============================ */
function ReviewList({ answers }) {
  const correctAnswers = answers.filter((a) => a.correct);
  const incorrectAnswers = answers.filter((a) => !a.correct);
  const choiceLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="review-section">
      {/* Incorrect answers first */}
      {incorrectAnswers.length > 0 && (
        <div className="review-block">
          <h3 className="review-block-title incorrect-title">
            ❌ 不正解の問題（{incorrectAnswers.length}問）
          </h3>
          <p className="review-block-subtitle">しっかり復習しよう！</p>
          {incorrectAnswers.map((a, idx) => (
            <div key={idx} className="review-item incorrect">
              <div className="review-item-header">
                <span className="review-q-num">問{a.question.id}</span>
                <span className="review-badge-wrong">不正解</span>
              </div>
              <p className="review-q-text">{a.question.question}</p>
              <div className="review-answer-row">
                <span className="review-your-answer wrong">
                  あなたの回答：{choiceLabels[a.selected - 1]}. {a.question.choices[a.selected - 1]}
                </span>
              </div>
              <div className="review-answer-row">
                <span className="review-correct-answer">
                  正解：{choiceLabels[a.question.answer - 1]}. {a.question.choices[a.question.answer - 1]}
                </span>
              </div>
              <p className="review-explanation">{a.question.explanation}</p>
              <p className="review-page">📖 教科書 {a.question.page}</p>
            </div>
          ))}
        </div>
      )}

      {/* Correct answers */}
      {correctAnswers.length > 0 && (
        <div className="review-block">
          <h3 className="review-block-title correct-title">
            ✅ 正解の問題（{correctAnswers.length}問）
          </h3>
          {correctAnswers.map((a, idx) => (
            <div key={idx} className="review-item correct">
              <div className="review-item-header">
                <span className="review-q-num">問{a.question.id}</span>
                <span className="review-badge-ok">正解</span>
              </div>
              <p className="review-q-text">{a.question.question}</p>
              <div className="review-answer-row">
                <span className="review-correct-answer">
                  {choiceLabels[a.question.answer - 1]}. {a.question.choices[a.question.answer - 1]}
                </span>
              </div>
              <p className="review-explanation">{a.question.explanation}</p>
              <p className="review-page">📖 教科書 {a.question.page}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================
   Result Screen
   ============================ */
function Result({ score, total, answers, onRetry, onHome }) {
  const pct = Math.round((score / total) * 100);
  const circumference = 2 * Math.PI * 76;
  const offset = circumference - (pct / 100) * circumference;

  const getRank = () => {
    if (pct === 100) return { icon: '👑', title: '情報マスター', cls: 'excellent', msg: '完璧です！あなたは情報の達人！自信を持って本番に臨みましょう！' };
    if (pct >= 80) return { icon: '🌟', title: 'エキスパート', cls: 'excellent', msg: '素晴らしい成績です！あと少しで満点です。間違えた問題を復習すれば本番は万全です！' };
    if (pct >= 60) return { icon: '💪', title: 'チャレンジャー', cls: 'good', msg: 'いい調子です！下の復習リストで間違えた問題を確認しましょう！' };
    if (pct >= 40) return { icon: '📖', title: 'ルーキー', cls: 'ok', msg: 'まだまだ伸びしろがあります！下の復習リストと教科書で確認しましょう！' };
    return { icon: '🔥', title: 'スタート地点', cls: 'ok', msg: '焦らず一歩ずつ！下の復習リストで弱点を確認し、教科書を読み直しましょう！' };
  };

  const rank = getRank();

  useMemo(() => {
    if (pct >= 80) {
      const duration = 2000;
      const end = Date.now() + duration;
      const colors = ['#fbbf24', '#fb923c', '#22d3ee', '#a78bfa', '#34d399'];
      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, []);

  return (
    <div className="result">
      <div className="result-card">
        <div className="result-icon">{rank.icon}</div>
        <h2 className={`result-title ${rank.cls}`}>{rank.title}</h2>
        <p className="result-subtitle">あなたの成績をチェック！</p>

        {/* Animated Score Ring */}
        <div className="score-ring-container">
          <div className="score-ring">
            <svg width="180" height="180">
              <circle cx="90" cy="90" r="76" fill="none" strokeWidth="10" className="ring-bg" />
              <circle
                cx="90" cy="90" r="76"
                fill="none"
                strokeWidth="10"
                className={`ring-fill ${rank.cls}`}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="score-center">
              <div className="score-number">{pct}%</div>
              <div className="score-label">正答率</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-item correct-stat">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{score}</div>
            <div className="stat-label">正解</div>
          </div>
          <div className="stat-item incorrect-stat">
            <div className="stat-icon">❌</div>
            <div className="stat-value">{total - score}</div>
            <div className="stat-label">不正解</div>
          </div>
          <div className="stat-item rate-stat">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{score}/{total}</div>
            <div className="stat-label">スコア</div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="encouragement">{rank.msg}</div>
      </div>

      {/* Review List */}
      <ReviewList answers={answers} />

      {/* Action buttons */}
      <div className="result-actions">
        <button className="retry-btn" onClick={onRetry}>
          🔄 もう一度チャレンジ
        </button>
        <button className="home-btn" onClick={onHome}>
          🏠 トップに戻る
        </button>
      </div>
    </div>
  );
}

/* ============================
   App Root
   ============================ */
export default function App() {
  // 'intro' | 'disclaimer' | 'quiz' | 'result'
  const [screen, setScreen] = useState('intro');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAnswers, setFinalAnswers] = useState([]);
  const [quizMode, setQuizMode] = useState('random'); // 'random' | 'sequential'
  const [seqStartNum, setSeqStartNum] = useState(1);

  const handleStartRandom = useCallback(() => {
    setQuizMode('random');
    setQuizQuestions(pickRandom(allQuestions, 10));
    setScreen('quiz');
  }, []);

  const handleStartSequential = useCallback((startFrom) => {
    setQuizMode('sequential');
    setSeqStartNum(startFrom);
    // Questions from startFrom to end
    const subset = allQuestions.slice(startFrom - 1);
    setQuizQuestions(subset);
    setScreen('quiz');
  }, []);

  const handleFinish = useCallback((s, ans) => {
    setFinalScore(s);
    setFinalAnswers(ans);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRetry = useCallback(() => {
    if (quizMode === 'random') {
      setQuizQuestions(pickRandom(allQuestions, 10));
    } else {
      const subset = allQuestions.slice(seqStartNum - 1);
      setQuizQuestions(subset);
    }
    setFinalScore(0);
    setFinalAnswers([]);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [quizMode, seqStartNum]);

  const handleHome = useCallback(() => {
    setScreen('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <BgOrbs />
      <div className="app-container">
        {screen === 'intro' && (
          <Intro
            onStartRandom={handleStartRandom}
            onStartSequential={handleStartSequential}
            onShowDisclaimer={() => setScreen('disclaimer')}
          />
        )}
        {screen === 'disclaimer' && (
          <Disclaimer onBack={() => setScreen('intro')} />
        )}
        {screen === 'quiz' && (
          <Quiz
            questions={quizQuestions}
            onFinish={handleFinish}
            startNumber={quizMode === 'sequential' ? seqStartNum : null}
          />
        )}
        {screen === 'result' && (
          <Result
            score={finalScore}
            total={quizQuestions.length}
            answers={finalAnswers}
            onRetry={handleRetry}
            onHome={handleHome}
          />
        )}
      </div>
    </>
  );
}
