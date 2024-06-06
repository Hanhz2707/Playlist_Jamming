let accessToken = '';
const clientID = '5b52ef79721249de987db81eb1e1b5aa';
const redirectURL = 'https://hanhz2707.github.io/Playlist_Jamming/';


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

        if (tokenInURL && expiryTime) {
            //Setting access token and expiry time variables
            accessToken = tokenInURL[1];
            const expires_in = Number(expiryTime[1]);

            //Setting the function which will reset the access token when it expires
            window.setTimeout(() => accessToken = '', expires_in * 1000);

            //Clearing the url after the access token expires
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            //Third check for the access token if the first two checks fail
            const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
            window.location = redirect;
        }


    },

    search(term) {
        accessToken = Spotify.getAccessToken();
        console.log(accessToken);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },

        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                console.error('No tracks found in the search');

            }
            return jsonResponse.tracks.items.map((track) => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch(`https://api.spotify.com/v1/me`, { headers: header })

            .then(response => {
                return response.json()
                })
            .then(jsonResponse => {
                userId = jsonResponse.id;
                let playlistId;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: header,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                    
                }).then(response => {
                    return response.json()
                }).then(jsonResponse => {
                        const playlistId = jsonResponse.id;
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: header,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs })
                        });
                    });
            });


    },
};
export { Spotify };