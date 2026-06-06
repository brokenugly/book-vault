import { Mail, Twitter, Github, Instagram, Send, MessageCircle } from 'lucide-react';

const SOCIALS = [
  { icon: Twitter,        label: 'Twitter / X',  handle: '@bookvault' },
  { icon: Instagram,      label: 'Instagram',     handle: '@bookvault.app' },
  { icon: Github,         label: 'GitHub',        handle: 'github.com/bookvault' },
  { icon: Send,           label: 'Telegram',      handle: '@bookvault_app' },
  { icon: MessageCircle,  label: 'VK',            handle: 'vk.com/bookvault' },
];

const ContactsPage = () => (
  <div className="container mx-auto px-4 py-12 max-w-2xl">
    <h1 className="text-3xl font-bold mb-2">Контакты</h1>
    <p className="text-muted-foreground mb-8">
      Свяжитесь с нами удобным способом – мы всегда рады вашим вопросам и предложениям.
    </p>

    {/* Email block */}
    <div className="flex items-center gap-4 p-5 border rounded-xl bg-card mb-6">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Mail className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Электронная почта</p>
        <a className="font-semibold">support@bookvault.app</a>
        <p className="text-xs text-muted-foreground mt-0.5">Отвечаем в течение 1-2 рабочих дней</p>
      </div>
    </div>

    {/* Social links */}
    <h2 className="font-semibold mb-4">Мы в соцсетях</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SOCIALS.map(({ icon: Icon, label, handle }) => (
        <div
          key={label}
          className="flex items-center gap-3 p-4 border rounded-xl bg-card cursor-default
                     hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground truncate">{handle}</p>
          </div>
        </div>
      ))}
    </div>

    <p className="mt-8 text-sm text-muted-foreground">
      Для технических вопросов воспользуйтесь формой{' '}
      <a href="/support" className="text-primary hover:underline">
        техподдержки
      </a>
      .
    </p>
  </div>
);

export default ContactsPage;
