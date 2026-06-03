import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PrivateRoute from '../components/common/PrivateRoute';

// Pages
import HomePage from '../pages/HomePage';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Profile from '../features/auth/Profile';
import SearchPage from '../features/books/SearchPage';
import BookDetails from '../features/books/BookDetails';
import GenrePage from '../features/books/GenrePage';
import MyBooks from '../features/userLibrary/MyBooks';
import NewReview from '../features/reviews/NewReview';
import AllReviews from '../features/reviews/AllReviews';
import CollectionsPage from '../pages/CollectionsPage';
import CollectionDetailPage from '../pages/CollectionDetailPage';
import NewsPage from '../pages/NewsPage';
import AboutPage from '../pages/AboutPage';
import ContactsPage from '../pages/ContactsPage';
import FaqPage from '../pages/FaqPage';
import RulesPage from '../pages/RulesPage';
import SupportPage from '../pages/SupportPage';
import TestsListPage from '../pages/TestsListPage';
import TestPage from '../pages/TestPage';
import { ReportPage, NotFoundPage } from '../pages/StubPages';

// Redirect /genres/:genre → /genres?genre=:genre  (backward compat)
const GenreParamRedirect = () => {
  const { genre } = useParams();
  return <Navigate to={`/genres${genre ? `?genre=${genre}` : ''}`} replace />;
};

// Auth pages have their own full-screen layout (no header/footer)
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-background">{children}</div>
);

const App = () => (
  <Routes>
    {/* Auth — no header/footer */}
    <Route path="/login"    element={<AuthLayout><Login /></AuthLayout>} />
    <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

    {/* Main layout */}
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />

      {/* Books */}
      <Route path="/search"  element={<SearchPage />} />
      <Route path="/book/:id" element={<BookDetails />} />
	  
	  {/* Reviews */}
      <Route path="/book/:bookId/reviews" element={<AllReviews />} />
      <Route path="/book/:bookId/reviews/new" element={<PrivateRoute><NewReview /></PrivateRoute>} />

      {/* Genres page */}
      <Route path="/genres" element={<GenrePage />} />
      <Route path="/genres/:genre" element={<GenreParamRedirect />} />

      {/* Protected */}
      <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} />
	  
	  {/* Collections */}
      <Route path="/collections"       element={<CollectionsPage />} />
      <Route path="/collections/:slug" element={<CollectionDetailPage />} />
	  
	  {/* Tests */}
      <Route path="/tests"         element={<TestsListPage />} />
      <Route path="/tests/:testId" element={<TestPage />} />

      {/* Content & info pages */}
      <Route path="/news"     element={<NewsPage />} />
      <Route path="/about"    element={<AboutPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/faq"      element={<FaqPage />} />
      <Route path="/rules"    element={<RulesPage />} />
      <Route path="/support"  element={<SupportPage />} />
      <Route path="/report"   element={<ReportPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;