import "./Home.css";

import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;
  const totalPages = Math.ceil(totalCount / limit);
  const pageWindowSize = 5;
  const currentPage = Math.floor(offset / limit) + 1;
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [types, setTypes] = useState([]);

  let startPage = Math.max(1, currentPage - Math.floor(pageWindowSize / 2));
  let endPage = startPage + pageWindowSize - 1;

  // logic for filter:
  const filteredPokemon = pokemonList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchType = type ? p.types.includes(type) : true;

    return matchSearch && matchType;
  });

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      );
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
      setTotalCount(data.count);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data = await res.json();

        // filter only real battle types (optional)
        const filteredTypes = data.results.filter(
          (t) => !["shadow", "unknown"].includes(t.name),
        );

        setTypes(filteredTypes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    fetchPokemon();
  }, [offset]);

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavs);
  }, []);

  const toggleFavorite = (name) => {
    let updatedFavs;

    if (favorites.includes(name)) {
      updatedFavs = favorites.filter((f) => f !== name);
    } else {
      updatedFavs = [...favorites, name];
    }

    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;

  // Fix if exceeding total pages
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - pageWindowSize + 1);
  }
  return (
    <>
      <Navbar />
      <div className="main-content">
        <div className="filters p-3">
          <div className="search-bar me-5">
            <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control me-3"
                type="search"
                placeholder="Search Pokedex"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          <div className="filter me-5">
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All</option>

              {types.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredPokemon.length === 0 ? (
          <div className="pokemon-not-found mt-5">
            <h4>No Pokemon found 😔</h4>
            <p>Try a different search or filter</p>
          </div>
        ) : (
          <div className="pokemon-list">
            {filteredPokemon.map((p) => (
              <div key={p.id}>
                <div
                  className="pokemon-card card p-3 shadow-sm position-relative"
                  onClick={() => navigate(`/pokemon/${p.name}`)}
                >
                  <img src={p.image} alt={p.name} height={100} width={100} />

                  <div className="pokemon-body">
                    <h5 className="text-capitalize">{p.name}</h5>

                    <div className="d-flex justify-content-center gap-2 mt-1">
                      {p.types.map((type) => (
                        <span key={type} className="badge">
                          {type}
                        </span>
                      ))}
                    </div>

                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.name);
                      }}
                    >
                      {favorites.includes(p.name) ? "❤️" : "🤍"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!search && !type && (
          <div
            aria-label="Pokemon pagination"
            className="pokemon-pagination p-2"
          >
            <ul className="pagination justify-content-center my-4">
              <li className={`page-item ${offset === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setOffset(offset - limit)}
                  disabled={offset === 0}
                >
                  Previous
                </button>
              </li>

              {startPage > 1 && (
                <>
                  <li className="page-item">
                    <button className="page-link" onClick={() => setOffset(0)}>
                      1
                    </button>
                  </li>
                  {startPage > 2 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                </>
              )}

              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i,
              ).map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setOffset((page - 1) * limit)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => setOffset((totalPages - 1) * limit)}
                    >
                      {totalPages}
                    </button>
                  </li>
                  <li
                    className={`page-item ${offset + limit >= totalCount ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setOffset(offset + limit)}
                      disabled={offset + limit >= totalCount}
                    >
                      Next
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
export default Home;
