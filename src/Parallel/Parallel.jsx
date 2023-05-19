import { useState, useEffect } from "react";

async function fetchEpisodes() {
  const res = await fetch("https://rickandmortyapi.com/api/episode");
  return res.json();
}

async function fetchCharacters(id) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  return res.json();
}

function Parallel() {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const promiseEpisodes = fetchEpisodes();
      // const promiseCharacters = fetchCharacters();

      const [episodesData, charactersData] = await Promise.all([
        promiseEpisodes,
        // promiseCharacters,
      ]).then(console.log("checking"));

      setEpisodes(episodesData.results);
      // setCharacters(charactersData.results);
    };
    fetchAll();
  }, []);

  
  function getIdsPerEpisode() {

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
    console.log(idsSet);

    const promiseIds = [];
    console.log("🚀 ~ file: Parallel.jsx:53 ~ getIdsPerEpisode ~ promiseIds:", promiseIds)
    for (const id of idsSet) {
      promiseIds.push(fetchCharacters(id));
    }
  }

  getIdsPerEpisode();


  return (
    <>
      <h1>episodios</h1>
      {episodes.map((episode) => {
        return (
          <div key={episode.id}>
            <h1>{episode.name}</h1>
            <h2>Fecha al aire: {episode.air_date}</h2>
            <h2>personajes:</h2>
            {/* Aca irian los personajes */}
            <h2></h2>
            <hr />
          </div>
        );
      })}
    </>
  );
}

export default Parallel;
