performSearch = (query = "nature") => {
  axios
    .get(
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.state.apiKey}&text=${query}&per_page=24&page=2&format=json&nojsoncallback=true`
    )
    .then((response) => {
      console.log(response);
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({
          query: query,
          imgs: response.photos.photo,
          loading: false,
        });
      }, 150);
    })
    .catch((error) => {
      console.log("Error fetching and parsing data", error);
    });
};

const elena =
  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d47474571f75e49d5d17df2722a8a28&text=catdog&per_page=24&page=1&format=json&nojsoncallback=true";
