import React, {useState} from "react";
import styles from "./App.module.css";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import  {Spotify} from "../../utils/Spotify";

function App () {

  const [searchResults, setSearchResults] = useState(
    [
      {name: "name1", artist: "artist1", album: "album1", id: 1},
      {name: "name2", artist: "artist2", album: "album2", id: 2},
      {name: "name3", artist: "artist3", album: "album3", id: 3}
    ]
  );

  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState(
    [
      {name: "playlist1", artist: "playlistartist1", album: "playlistalbum1", id: 1},
      {name: "name2", artist: "artist2", album: "album2", id: 2},
      {name: "name3", artist: "artist3", album: "album3", id: 3}
    ]
  );

  const addTrack = (track) => {
    const existingTrack = playlistTracks.find((t) => t.id === track.id);
    const newTrack = playlistTracks.concat(track);

    if (existingTrack) {
      console.log("Track already exists in playlist");
    }else{
      setPlaylistTracks(newTrack);
    }
  };


  const removeTrack = (track) => {
    const existingTrack = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(existingTrack);
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  };

  const search = (term) => {
    Spotify.search(term).then((result) => setSearchResults(result));
    console.log(term);
  };

    return (
      <div>
        <h1>
          Ja<span className={styles.highlight}>mmm</span>ing
        </h1>
        <div className={styles.App}>
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar onSearch={search} />
          <div className={styles['App-playlist']}>
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults userSearchResults={searchResults} onAdd={addTrack} />
            {/* <!-- Add a Playlist component --> */}
            <Playlist playlistName={playlistName} playlistTracks={playlistTracks} onRemove={removeTrack} onNameChange={updatePlaylistName} onSave={savePlaylist} />
          </div>
        </div>
      </div>
  );
}

export default App;