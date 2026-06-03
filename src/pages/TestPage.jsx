import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { upsertUserTest } from '../services/firestore';
import { getTestById } from '../constants/testsData';
import { cn } from '../lib/utils';

const TestPage = () => {
  const { testId }   = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const test         = getTestById(testId);

  const [answers,   setAnswers]   = useState(() => test ? Array(test.questions.length).fill(null) : []);
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!test) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Тест не найден.</p>
        <Button variant="outline" asChild><Link to="/tests">← Все тесты</Link></Button>
      </div>
    );
  }

  const handleAnswer = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const handleSubmit = async () => {
	  // Compute score synchronously BEFORE state update to avoid stale closure
    const score = answers.filter((a, i) => a === test.questions[i].correctIndex).length;
    setFinalScore(score);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (user) {
      setSaving(true);
      try {
        await upsertUserTest({
          userId: user.uid,
          testId,
          score,
          total:  test.questions.length,
        });
        setSaved(true);
      } catch {
        setSaveError('Не удалось сохранить результат.');
      } finally {
        setSaving(false);
      }
    }
  };
  
  const handleRetry = () => {
    setAnswers(Array(test.questions.length).fill(null));
    setSubmitted(false);
    setFinalScore(0);
    setSaved(false);
    setSaveError('');
  };

  const allAnswered = answers.every((a) => a !== null);
  const total = test.questions.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-1">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Button>

      {/* Title */}
      <div className="flex items-start gap-3 mb-6">
        <span className="text-4xl select-none">{test.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold">{test.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{test.description}</p>
        </div>
      </div>

      {/* Result banner */}
      {submitted && (
        <div className={cn(
          'rounded-xl p-5 mb-6 flex items-center gap-4',
          finalScore === total
            ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
            : finalScore >= total / 2
            ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
            : 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'
        )}>
          <Trophy className="w-10 h-10 text-primary shrink-0" />
          <div>
            <p className="font-bold text-lg">Правильных ответов: {finalScore} из {total}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {finalScore === total && 'Отлично! Все ответы верны!'}
              {finalScore >= total / 2 && finalScore < total && 'Хороший результат!'}
              {finalScore < total / 2 && 'Попробуйте ещё раз!'}
            </p>
            {saving && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Сохраняем…</p>}
            {saved  && <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">✓ Результаты теста сохранены в вашем профиле!</p>}
            {saveError && <p className="text-xs text-destructive mt-1">{saveError}</p>}
            {!user && <p className="text-xs text-muted-foreground mt-1"><Link to="/login" className="text-primary hover:underline">Войдите</Link>, чтобы сохранить результат.</p>}
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {test.questions.map((q, qi) => (
          <div key={qi} className="border rounded-xl overflow-hidden">
            {/* Image placeholder */}
            <div className="w-full h-12 bg-muted/40 border-b" />
            <div className="p-5">
              <p className="font-semibold mb-3 text-sm sm:text-base">
                <span className="text-primary mr-2">{qi + 1}.</span>
                {q.text}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const chosen   = answers[qi] === oi;
                  const correct  = oi === q.correctIndex;
                  const wrong    = submitted && chosen && !correct;
                  const showRight = submitted && correct;

                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => handleAnswer(qi, oi)}
                      disabled={submitted}
                      className={cn(
                        'flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors',
                        !submitted && chosen && 'bg-primary/10 border-primary',
                        !submitted && !chosen && 'hover:bg-accent',
                        showRight && 'bg-green-50 dark:bg-green-950/30 border-green-400',
                        wrong && 'bg-red-50 dark:bg-red-950/30 border-red-400',
                        submitted && !chosen && !correct && 'opacity-60'
                      )}
                    >
                      {submitted && correct && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                      {submitted && wrong    && <XCircle     className="w-4 h-4 text-red-500 shrink-0"   />}
                      {(!submitted || (!correct && !wrong)) && (
                        <span className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0',
                          chosen && !submitted ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'
                        )}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                      )}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {!submitted ? (
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {!allAnswered
              ? `Ответьте на все вопросы (${answers.filter(a => a !== null).length}/${test.questions.length})`
              : 'Завершить тест'}
          </Button>
        ) : (
          <>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/tests">Другие тесты</Link>
            </Button>
            <Button
              className="flex-1"
              onClick={ handleRetry }
            >
              Пройти снова
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TestPage;
