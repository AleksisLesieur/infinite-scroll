import React, { useEffect, useState, useRef, Component } from "react";
import "./App.scss";
import { ReactComponent as Loading } from "./Loading.svg";

function App() {
  // console.warn = console.error = () => {};

  let [photos, setPhotos] = useState([]);

  let [favoritesArray, setFavoritesArray] = useState([]);

  // let [showingAllPhotos, setShowingAllPhotos] = useState([]);

  // let [showingFavoritePhotos, setShowingFavoritePhotos] = useState([]);

  let [myElementIsVisible, setMyElementIsVisible] = useState(true);

  let [page, setPage] = useState(1);

  let [favoriteText, setFavoriteText] = useState("Favorites");

  let [showFavorites, setShowFavorites] = useState(false);

  let [searchPhotos, setSearchPhotos] = useState("dogs");

  let [reRender, setReRender] = useState(true);

  const myRef = useRef();

  let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d47474571f75e49d5d17df2722a8a28&text=${searchPhotos}&per_page=12&page=${page}&format=json&nojsoncallback=true`;

  function toggleFavorite() {
    if (showFavorites) {
      setFavoriteText("Go back");
      setShowFavorites(!showFavorites);
      // console.log(favoritesArray);
      // showingAllPhotos = photos;
      // setShowingAllPhotos(showingAllPhotos);
      // console.log(showFavorites + " showFavorites");
      // setFavoritesArray(localStorage.getItem("favoritesPictures"));
    } else {
      setFavoriteText("Favorites");
      setShowFavorites(!showFavorites);
      // console.log(favoritesArray);
      // showingAllPhotos = localStorage.getItem("favoritesPictures");
      // setShowingAllPhotos(showingAllPhotos);
      // console.log(showFavorites + " showFavorites");
    }
  }

  function saveToFavorites(element) {
    // alert("added to favorites!");
    setFavoritesArray((favoritesArray) => [...favoritesArray, element]);
    // console.log(favoritesArray);
    // removing duplicates

    let oldFavorites = JSON.parse(window.localStorage.getItem("favorites"));
    // console.log(oldFavorites);
    if (!oldFavorites) {
      oldFavorites = [];
    }
    if (
      oldFavorites.find(function (item) {
        return item.id === element.id;
      })
    ) {
      alert("it has been already saved to favorites");
    } else {
      oldFavorites.push(element);
      alert("the image has been saved!");
    }
    window.localStorage.setItem("favorites", JSON.stringify(oldFavorites));
  }

  function removeFavorite(id) {
    let oldFavorites = JSON.parse(window.localStorage.getItem("favorites"));
    if (!oldFavorites) {
      oldFavorites = [];
    }
    oldFavorites = oldFavorites.filter(function (item) {
      return item.id !== id;
    });
    window.localStorage.setItem("favorites", JSON.stringify(oldFavorites));
    setReRender(!reRender);
  }

  // if (myElementIsVisible) {
  //   console.log("svg has been Reached");
  // }

  useEffect(() => {
    loadApp();
    performSearch(searchPhotos, page);
    loadingMoreImages(searchPhotos, page);
    // console.log(myRef.current);
    observer.observe(myRef.current);
    // localStorage.setItem("favoritesPictures", JSON.stringify(favoritesArray));
  }, []);

  async function loadApp() {
    await fetch(url)
      .then((res) => res.json())
      .then((res) => setPhotos(res.photos.photo));
    toggleFavorite();
  }

  async function performSearch(searchPhotos) {
    url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d47474571f75e49d5d17df2722a8a28&text=${searchPhotos}&per_page=12&page=1&format=json&nojsoncallback=true`;
    await fetch(url)
      .then((res) => res.json())
      .then((res) => setPhotos((photos) => [...photos, ...res.photos.photo]));
    // .then((res) => setPhotos([...photos, ...res.photos.photo]));
    // .then((res) => setPhotos(photos.push(...res.photos.photo)));
    // console.log(photos);
    // setPhotos(photos);
  }

  async function loadingMoreImages(searchPhotos, page) {
    url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d47474571f75e49d5d17df2722a8a28&text=${searchPhotos}&per_page=12&page=${page}&format=json&nojsoncallback=true`;
    await fetch(url)
      .then((res) => res.json())
      .then((res) => photos.push(...res.photos.photo));
    // .then((res) => setPhotos((photos) => [...photos, ...res.photos.photo]));
    // .then((res) => setPhotos([...photos, ...res.photos.photo]));
    // .then((res) => setPhotos(photos.push(...res.photos.photo)));
    // console.log(photos);
    setPhotos(photos);
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    setMyElementIsVisible(entry.isIntersecting);
    if (myElementIsVisible) {
      page = page + 1;
      loadingMoreImages(searchPhotos, page);
      // console.log(page);
      setPhotos(photos);
    }
  });

  const storingSearch = useRef(null);

  let localStorageArray = !!JSON.parse(window.localStorage.getItem("favorites"))
    .length;

  return (
    <div className="body">
      <div className="search">
        {/* <div className="text-area">
          <input
            ref={storingSearch}
            type="text"
            placeholder="Search for..."
          ></input>
          <button
            onClick={function () {
              setSearchPhotos((searchPhotos = storingSearch.current.value));
              setPhotos(photos.splice(0, photos.length - 1));
              performSearch(searchPhotos);
              // loadingMoreImages(searchPhotos, page);
              // console.log(searchPhotos);
            }}
          >
            Search
          </button>
        </div> */}
        <span onClick={toggleFavorite}>{favoriteText}</span>
      </div>
      {showFavorites && (
        <>
          <div className="photos">
            {photos.map(function (element, index) {
              if (element.title.length >= 18) {
                element.title = element.title.slice(0, 18);
              }
              return (
                <div key={index} className="hover">
                  <img
                    src={`https://live.staticflickr.com/${element.server}/${element.id}_${element.secret}_w.jpg`}
                    alt={`${element.id}`}
                  />
                  <div className="title">{element.title}</div>
                  <div
                    onClick={function () {
                      saveToFavorites(element);
                    }}
                    className="fav-html"
                  >
                    Favorite
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {!showFavorites && (
        <div className="photos">
          {!localStorageArray && <h1>Empty list</h1>}

          {(JSON.parse(window.localStorage.getItem("favorites")) || []).map(
            function (element, index) {
              if (element.title.length >= 18) {
                element.title = element.title.slice(0, 18);
              }
              return (
                <div key={index} className="hover">
                  <img
                    src={`https://live.staticflickr.com/${element.server}/${element.id}_${element.secret}_w.jpg`}
                    alt={`${element.id}`}
                  />
                  <div className="title">{element.title}</div>
                  <div
                    onClick={() => removeFavorite(element.id)}
                    className="fav-html"
                  >
                    Remove
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
      <div className="loadingAnimation" ref={myRef}>
        {showFavorites && <Loading />}
      </div>
    </div>
  );
}

export default App;
