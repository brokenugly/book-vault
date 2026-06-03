import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import RatingStars from '../../components/common/RatingStars';
import { updateUserBook } from '../../services/firestore';
import { BOOK_STATUSES } from '../../utils/constants';

const BookStatusManager = ({ userBook, onUpdate }) => {
  const [status, setStatus] = useState(userBook.status || 'willRead');
  const [rating, setRating] = useState(userBook.userRating || 0);
  const [note, setNote] = useState(userBook.userNote || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = { status, userRating: rating, userNote: note };
      await updateUserBook(userBook.id, updates);
      onUpdate?.({ ...userBook, ...updates });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <h3 className="font-semibold text-sm">Моя коллекция</h3>

      <div className="space-y-1.5">
        <Label>Статус</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите статус" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(BOOK_STATUSES).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Моя оценка</Label>
        <RatingStars rating={rating} onRate={setRating} size="lg" />
      </div>

      <div className="space-y-1.5">
        <Label>Заметка</Label>
        <Textarea
          placeholder="Ваши мысли о книге..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
        {saving
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : saved
          ? <Check className="w-4 h-4" />
          : null}
        {saved ? 'Сохранено!' : 'Сохранить'}
      </Button>
    </div>
  );
};

export default BookStatusManager;
