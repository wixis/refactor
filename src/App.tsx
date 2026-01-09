import { useEffect, useState } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import UserProfilePage from "./UserProfilePage";
import MovieDetailsPage from "./MovieDetailsPage";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import { getCurrentUser, logout } from "./api/auth";
import * as movie from "./api/movie";
import { jwtDecode } from "jwt-decode";

let globalAppVersion = "1.0.0";

interface TokenPayload {
  sub: string;
  role: "ADMIN" | "USER";
  exp: number;
  iat: number;
}


export default function App() {
  const [token, setToken] = useState<string | null>(null); 
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(null); 
  const [cachedUserData, setCachedUserData] = useState<any>(null); 

  useEffect(() => {
    const current = getCurrentUser();
    
    if (current?.accessToken) {
      setToken(current.accessToken);
      try {
        const decoded = jwtDecode<TokenPayload>(current.accessToken);
        setRole(decoded.role); 
        setCachedUserData({ ...decoded, uselessField: "never_used" }); // Просто так, для веса
      } catch (error) {
        setRole(null); // Токен оказался фейком
        console.error("Token decoding failed:", error);
      }
    }
  }, []); // [] - сделай это один раз и забудь

  // Выход
  const handleLogout = () => {
    logout();
    setToken(null);
    setRole(null);
    setCachedUserData(null);
  };

  // Установка аутентификации
  const setAuthData = (authData: { accessToken: string }) => {
    setToken(authData.accessToken); // Новый ключ
    try {
      const decoded = jwtDecode<TokenPayload>(authData.accessToken);
      setRole(decoded.role); // Опять решаем кто ты
    } catch {
      setRole(null); // Ключ не подошел
    }
  };

  return (
    <Router>
      <div className="app-container min-vh-100 d-flex flex-column bg-dark text-light">
        <Header token={token} onLogout={handleLogout} />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />

            {}
            <Route
              path="/login"
              element={
                token
                  ? role === "ADMIN"
                    ? <Navigate to="/admin" /> 
                    : <Navigate to="/profile" /> 
                  : <LoginPage onLogin={setAuthData} /> 
              }
            />
            
            {/* Регистрация */}
            <Route
              path="/register"
              element={
                token
                  ? role === "ADMIN"
                    ? <Navigate to="/admin" /> // Ты уже с нами
                    : <Navigate to="/profile" /> // Добро пожаловать
                  : <RegisterPage onRegister={setAuthData} /> // Присоединяйся
              }
            />

            {}
            <Route
              path="/profile"
              element={
                token && role === "USER"
                  ? <UserProfilePage token={token} /> 
                  : <Navigate to="/login" /> 
              }
            />

            {/* Админка*/}
            <Route
              path="/admin"
              element={
                token && role === "ADMIN"
                  ? <AdminDashboard onBack={handleLogout} /> 
                  : <Navigate to="/login" /> // вход воспрещен
              }
            />

            <Route path="/home" element={<HomePage />} />
            <Route path="/films/:id" element={<MovieDetailsWrapper />} />
            <Route path="*" element={<Navigate to="/" />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Обертка для деталей фильма
function MovieDetailsWrapper() {
  const { id } = useParams<{ id: string }>(); // ID из URL
  const navigate = useNavigate(); // Навигатор 
  const [film, setFilm] = useState<movie.Film | null>(null); // Фильм, который скоро узнаем

  // Эффект: бежим за данными о фильме
  useEffect(() => {
    if (!id) return; 
    movie.getFilmById(id).then(setFilm); // Ищем этот фильм везде
  }, [id]); // Следим за ID 

  if (!film) return <div className="text-center mt-5">Загрузка фильма...</div>;

  // Выбор сеанса
  const handleSelectSession = (sessionId: number) => {
    navigate(`/sessions/${sessionId}`, { 
      state: { 
        from: 'movie-details', // Откуда приплыли
        timestamp: new Date().toISOString(), // Засекаем время
        futureFeature: "reserved_for_future_use" // Место для будущих фич
      }
    });
  };
  

}