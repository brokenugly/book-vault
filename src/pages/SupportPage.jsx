import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle, HeadphonesIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { addSupportMessage } from '../services/firestore';

const SUBJECTS = [
  { value: 'question',    label: 'Вопрос' },
  { value: 'suggestion',  label: 'Предложение' },
  { value: 'complaint',   label: 'Жалоба' },
  { value: 'other',       label: 'Другое' },
];

const SupportPage = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const validate = () => {
    if (!email.trim()) return 'Введите ваш email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email';
    if (!subject) return 'Выберите тему обращения';
    if (!message.trim()) return 'Введите текст сообщения';
    if (message.trim().length < 10) return 'Сообщение слишком короткое (минимум 10 символов)';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await addSupportMessage({ name: name.trim(), email: email.trim(), subject, message: message.trim() });
      setSuccess(true);
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch (err) {
      setError(err.message || 'Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Сообщение отправлено!</h2>
        <p className="text-muted-foreground mb-6">
          Мы получили ваше обращение и ответим на адрес <strong>{email || 'вашей почты'}</strong> в
          течение 1–2 рабочих дней.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/">На главную</Link>
          </Button>
          <Button onClick={() => setSuccess(false)}>
            Ещё одно обращение
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <HeadphonesIcon className="w-8 h-8 text-primary mt-0.5 shrink-0" />
        <div>
          <h1 className="text-3xl font-bold">Техподдержка</h1>
          <p className="text-muted-foreground mt-1">
            Напишите нам – мы ответим как можно скорее.{' '}
            Наш адрес: support@bookvault.app
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Name (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Ваше имя <span className="text-muted-foreground font-normal text-xs">(необязательно)</span>
          </Label>
          <Input
            id="name"
            placeholder="Иван"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading}
          />
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label>
            Тема <span className="text-destructive">*</span>
          </Label>
          <Select value={subject} onValueChange={setSubject} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тему обращения" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="message">
            Сообщение <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="Опишите вашу проблему или вопрос подробно..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            disabled={loading}
			className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">{message.length} симв.</p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Отправить обращение
        </Button>
      </form>

      <p className="mt-6 text-xs text-center text-muted-foreground">
        Ознакомьтесь с{' '}
        <Link to="/faq" className="text-primary hover:underline">FAQ</Link>
        {' '}– возможно, ответ уже там.
      </p>
    </div>
  );
};

export default SupportPage;
