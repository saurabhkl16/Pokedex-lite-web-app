import "./Home.css";

import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  // logic for filter:
  const filteredPokemon = pokemonList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchType = type ? p.types.includes(type) : true;

    return matchSearch && matchType;
  });

  const fetchPokemon = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const data = await res.json();

      const detailedData = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          const details = await res.json();

          return {
            id: details.id,
            name: details.name,
            image: details.sprites.other["official-artwork"].front_default,
            types: details.types.map((t) => t.type.name),
          };
        }),
      );

      setPokemonList(detailedData);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <>
      <Navbar />
      <div className="main-content pb-5">
        <div className="filters d-flex justify-content-center p-3">
          <div className="search-bar me-5">
            <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control me-3"
                type="search"
                placeholder="Search Pokedex"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* <button className="btn btn-danger">Search</button> */}
            </form>
          </div>

          <div className="filter me-5">
            <select
              className="form-select"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="fire">Fire</option>
              <option value="water">Water</option>
              <option value="grass">Grass</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        </div>

        <div className="pokemon-list container">
          {/* <div className="row"> */}
          {filteredPokemon.map((p) => (
            <div key={p.id} className="">
              <div className="pokemon-card card p-3 shadow-sm">
                <img src={p.image} alt={p.name} height={100} width={100} />

                <div className="pokemon-body">
                  <h5 className="text-capitalize">{p.name}</h5>

                  <div className="d-flex justify-content-center gap-2 mt-1">
                    {p.types.map((type) => (
                      <span key={type} className="badge bg-danger">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
export default Home;
