import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getUserCollections, addUserCollection, removeUserCollection } from '../services/firestore';
import { STATIC_COLLECTIONS } from '../constants/staticCollections';

const CollectionCard = ({ collection, isSaved, onToggle, saving }) => (
  <div className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    {/* Cover */}
    <Link to={`/collections/${collection.slug}`} className="block">
      <div
        className={`w-full aspect-[16/7] bg-gradient-to-br ${
          {
            'autumn-cozy':     'from-amber-100 to-orange-200 dark:from-amber-950/50 dark:to-orange-900/50',
            'strong-heroines': 'from-purple-100 to-pink-200 dark:from-purple-950/50 dark:to-pink-900/50',
            'space-sci-fi':    'from-blue-100 to-indigo-200 dark:from-blue-950/50 dark:to-indigo-900/50',
            'weekend-reads':   'from-green-100 to-teal-200 dark:from-green-950/50 dark:to-teal-900/50',
          }[collection.slug] || 'from-muted to-muted/50'
        } flex items-center justify-center text-5xl select-none`}
      >
        {collection.emoji}
      </div>
    </Link>

    <div className="flex flex-col gap-2 p-4 flex-1">
      <Link to={`/collections/${collection.slug}`}>
        <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
          {collection.title}
        </h3>
      </Link>
      <p className="text-xs text-muted-foreground line-clamp-2">{collection.description}</p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {collection.books.length} книги
        </span>

        <Button
          size="sm"
          variant={isSaved ? 'secondary' : 'outline'}
          className="gap-1.5 text-xs h-7 px-2.5"
          onClick={() => onToggle(collection.slug)}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isSaved ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
          {isSaved ? 'Убрать' : 'В профиль'}
        </Button>
      </div>
    </div>
  </div>
);

const CollectionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [saved, setSaved]  = useState(new Set());
  const [saving, setSaving] = useState(null); // slug being saved/removed

  useEffect(() => {
    if (!user) return;
    getUserCollections(user.uid)
      .then((list) => setSaved(new Set(list.map((c) => c.collectionSlug))))
      .catch(() => {});
  }, [user]);

  const handleToggle = async (slug) => {
    if (!user) { navigate('/login'); return; }
    setSaving(slug);
    try {
      if (saved.has(slug)) {
        await removeUserCollection(user.uid, slug);
        setSaved((prev) => { const n = new Set(prev); n.delete(slug); return n; });
      } else {
        await addUserCollection(user.uid, slug);
        setSaved((prev) => new Set([...prev, slug]));
      }
    } catch {
      // silent
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Подборки книг</h1>
        <p className="text-muted-foreground max-w-x1">
          Тематические списки, рекомендательные коллекции и редакционные подборки - всё, что
          поможет найти следующую любимую книгу.
        </p>
        {!user && (
          <p className="text-sm text-muted-foreground mt-2">
            <Link to="/login" className="text-primary hover:underline">Войдите</Link>
            , чтобы добавлять подборки в профиль.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATIC_COLLECTIONS.map((c) => (
          <CollectionCard
            key={c.slug}
            collection={c}
            isSaved={saved.has(c.slug)}
            onToggle={handleToggle}
            saving={saving === c.slug}
          />
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
        <Bookmark className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p className="font-medium">Больше подборок скоро появится</p>
        <p className="text-sm mt-1">Редакция BookVault регулярно составляет новые тематические списки.</p>
      </div>
    </div>
  );
};

export default CollectionsPage;
