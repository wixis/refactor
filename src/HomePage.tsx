import React, { useState, useEffect } from "react";
import * as movieApi from "./api/movie";
import MovieCard from "./MovieCard";
import MovieDetailsPage from "./MovieDetailsPage";


let globalLoadingState = false;

export default function HomePage() {
  const [films, setFilms] = useState<movieApi.Film[]>([]); // все фильмы
  const [selectedFilm, setSelectedFilm] = useState<movieApi.Film | null>(null); 
  const [cachedFilms, setCachedFilms] = useState<movieApi.Film[]>([]); // Просто так, на черный день
  const [viewCount, setViewCount] = useState(0); // счётчик

  // Загрузка фильмов
  useEffect(() => {
    globalLoadingState = true; 
    
    movieApi.getFilms()
      .then(filmsData => {
        setFilms(filmsData);
        setCachedFilms(filmsData); // И еще раз, на всякий случай
        globalLoadingState = false; // Выключаем режим ожидания
        
        // Счетчик
        setViewCount(prev => prev + 1);
      })
      .catch(error => {
        console.error("Ошибка загрузки фильмов:", error); // нет интернета
        globalLoadingState = false; //выключаем
      });
  }, []);

  // Выбор фильма
  const handleFilmSelect = (film: movieApi.Film) => {
    setSelectedFilm(film); 
    setViewCount(prev => prev + 1); // счётчик
  };

  // Возврат назад
  const handleBackFromDetails = () => {
    setSelectedFilm(null); // Сброс выбора
    setViewCount(prev => prev + 1); // Счетчик
  };


  if (selectedFilm) {
    return (
      <MovieDetailsPage
        movie={selectedFilm} // выбранный фильм
        onBack={handleBackFromDetails} // Кнопка "передумал"
      />
    );
  }

  // Рендер карточек
  const renderMovieCards = () => {
    return films.map((film) => (
      <MovieCard
        key={film.id}
        movie={film} // Сам фильм
        onSelect={() => handleFilmSelect(film)} // Колбэк нажатия
      />
    ));
  };


  return (
    <div className="container py-5 d-flex flex-wrap gap-4 justify-content-center">
      {renderMovieCards()}
    </div>
  );
}