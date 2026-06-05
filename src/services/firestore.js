import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── User Books ───

export const getUserBooks = async (userId) => {
  try {
    const q = query(collection(db, 'userBooks'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	items.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
	return items;
  } catch {
    throw new Error('Не удалось загрузить коллекцию книг');
  }
};

export const addUserBook = async (userId, bookData) => {
  try {
    const docRef = await addDoc(collection(db, 'userBooks'), {
      userId,
      bookId: bookData.bookId,
      title: bookData.title,
      authors: bookData.authors,
      thumbnail: bookData.thumbnail,
      status: bookData.status || 'willRead',
      userRating: bookData.userRating || null,
      userNote: bookData.userNote || '',
      addedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch {
    throw new Error('Не удалось добавить книгу');
  }
};

export const updateUserBook = async (docId, updates) => {
  try {
    await updateDoc(doc(db, 'userBooks', docId), { ...updates, updatedAt: serverTimestamp() });
  } catch {
    throw new Error('Не удалось обновить книгу');
  }
};

export const deleteUserBook = async (docId) => {
  await deleteDoc(doc(db, 'userBooks', docId));
};

export const checkBookExists = async (userId, bookId) => {
  try {
    const q = query(
      collection(db, 'userBooks'),
      where('userId', '==', userId),
      where('bookId', '==', bookId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch {
    return null;
  }
};

// ─── Support Messages ───

export const addSupportMessage = async (data) => {
  try {
    await addDoc(collection(db, 'supportMessages'), {
      name: data.name || '',
      email: data.email,
      subject: data.subject,
      message: data.message,
      createdAt: serverTimestamp(),
      to: 'btwrocket@gmail.com',
      replyTo: data.email,
    });
  } catch {
    throw new Error('Не удалось отправить сообщение. Попробуйте позже.');
  }
};
// ─── Reviews ───

const sortByDate = (arr) =>
  [...arr].sort((a, b) => {
    const at = a.createdAt?.seconds ?? a.createdAt?.toDate?.()?.getTime?.() / 1000 ?? 0;
    const bt = b.createdAt?.seconds ?? b.createdAt?.toDate?.()?.getTime?.() / 1000 ?? 0;
    return bt - at; // newest first
  });

export const addReview = async (data) => {
  const docRef = await addDoc(collection(db, 'reviews'), {
    bookId:    data.bookId,
    userId:    data.userId,
    userName:  data.userName,
    rating:    data.rating,
    title:     data.title,
    text:      data.text,
    createdAt: serverTimestamp(),
  });
  // Use first 6 chars of the Firestore auto-ID as shortId
  const shortId = docRef.id.slice(0, 6).toUpperCase();
  await updateDoc(docRef, { shortId });
  return { id: docRef.id, shortId };
};

/** Fetch all reviews for a book, newest first */
export const getReviewsByBook = async (bookId) => {
  try {
    const q = query(collection(db, 'reviews'), where('bookId', '==', bookId));
    const snapshot = await getDocs(q);
    let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	items.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
	return items;
  } catch (err) {
    console.error('getReviewsByBook error:', err);
    return [];
  }
};

/** Returns existing review doc for this user+book, or null */
export const checkUserReview = async (userId, bookId) => {
  try {
    const q = query(collection(db, 'reviews'), where('userId', '==', userId), where('bookId', '==', bookId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch { return null; }
};

export const getReviewsByUser = async (userId) => {
  try {
    const q = query(collection(db, 'reviews'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return sortByDate(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch { return []; }
};

export const deleteReview = async (docId) => {
  await deleteDoc(doc(db, 'reviews', docId));
};

// ─── User Collections (saved static collections) ───

export const getUserCollections = async (userId) => {
  try {
    const q = query(collection(db, 'userCollections'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	items.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
	return items;
  } catch { return []; }
};

export const addUserCollection = async (userId, collectionSlug) => {
  const docRef = await addDoc(collection(db, 'userCollections'), {
    userId,
    collectionSlug,
    addedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const removeUserCollection = async (userId, collectionSlug) => {
  const q = query(
    collection(db, 'userCollections'),
    where('userId', '==', userId),
    where('collectionSlug', '==', collectionSlug)
  );
  const snapshot = await getDocs(q);
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
};

export const checkUserCollection = async (userId, collectionSlug) => {
  try {
    const q = query(collection(db, 'userCollections'), where('userId', '==', userId), where('collectionSlug', '==', collectionSlug));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch { return false; }
};

// ─── User Tests ───

export const upsertUserTest = async (data) => {
  const q = query(collection(db, 'userTests'), where('userId', '==', data.userId), where('testId', '==', data.testId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existing = snapshot.docs[0];
    await updateDoc(existing.ref, { score: data.score, total: data.total, completedAt: serverTimestamp() });
    return existing.id;
  }

  const docRef = await addDoc(collection(db, 'userTests'), {
    userId: data.userId, testId: data.testId,
    score: data.score, total: data.total, completedAt: serverTimestamp(),
  });
  return docRef.id;
};

/** Alias kept for backward compatibility */
export const saveUserTest = upsertUserTest;

export const getUserTests = async (userId) => {
  try {
    const q = query(collection(db, 'userTests'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	items.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
	return items;
  } catch (error) { console.error('getUserTests error:', error); throw error; }
};
