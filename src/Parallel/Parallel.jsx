import { useState, useEffect } from "react";

async function fetchEpisodes() {
  const res = await fetch("https://rickandmortyapi.com/api/episode");
  const data = await res.json();
  const episodes = data.results
  return episodes;
}

async function fetchCharacters(id) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  return res.json();
}


  async function getData() {
    
    const episodes = await fetchEpisodes();
    
    const charactersUrl = [];
    const idsSet = new Set();

    episodes.forEach((episode) => {
      const charactersUrls = episode.characters;
      while (charactersUrls.length > 10) {
        charactersUrls.pop();
      }
      charactersUrl.push(...charactersUrls);
    });

    charactersUrl.forEach((url) => {
      const splitUrl = url.split("/");
      idsSet.add(splitUrl[splitUrl.length - 1]);
    });

    const promiseIds = [];
    for (const id of idsSet) {
      promiseIds.push(fetchCharacters(id));
    }

    const characters = await Promise.all(promiseIds);

    const episodesAndCharacters = episodes.map((episode) => {
      return {
        id: episode.id,
        title: `Title: ${episode.name}`,
        episode: episode.episode,
        airDate: episode.air_date, 
        characters: episode.characters.slice(0, 10).map((url) => {
          return characters.find((item) => item.url === url);
        })
      }
    })
    return episodesAndCharacters;  
  } 
  console.log(getData()); 
  

function Parallel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData().then((data) => {
      setData(data)})
  }, []);

  return (
    <>
      <h1>episodios</h1>
      {data.map((episode) => {
        return (
          <div key={episode.id}>
            <h1>{episode.title}</h1>
            <h2>On air: {episode.airDate}</h2>
            <h3>Characters:</h3>
            <ul>
            {episode.characters.map((character) =>{
              return (
                <li key={character.id}>
                <p><strong>Name:</strong> {character.name} - <em>{character.species}</em></p>
              </li>
              )
            })}
            </ul>
            <hr />
          </div>
        );
      })}
    </>
  );
}

export default Parallel;
