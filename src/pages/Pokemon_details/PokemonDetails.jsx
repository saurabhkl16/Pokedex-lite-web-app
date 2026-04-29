import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PokemonDetails.css";
import Navbar from "../../components/navbar/Navbar";

function PokemonDetails() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      setPokemon(data);
    };

    fetchDetails();
  }, [name]);

  if (!pokemon) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <>
      <div className="pokemon-details">
        <Navbar />
        <div className="container mt-5 d-flex w-100">
          <div className="left bg-secondary text-center">
            <img
            className="pokemon-img"
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              width={500}
            />
            <h2 className="text-capitalize">{pokemon.name}</h2>
          </div>
          <div className="right">
            <h4 className="mt-3">Types</h4>
            <div>
              {pokemon.types.map((t) => (
                <span key={t.type.name} className="badge bg-danger me-2">
                  {t.type.name}
                </span>
              ))}
            </div>

            <h4 className="mt-3">Abilities</h4>

            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} className="badge bg-danger me-2">
                {a.ability.name}
              </span>
            ))}

            <h4 className="mt-3">Moves</h4>
            <div>
              {pokemon.moves.slice(0, 10).map((m) => (
                <span key={m.move.name} className="badge bg-danger me-2 mb-2">
                  {m.move.name}
                </span>
              ))}
            </div>

            <h4 className="mt-3">Stats</h4>
            <div>
              {pokemon.stats.map((s) => (
                <div
                  key={s.stat.name}
                  className="d-flex justify-content-between mb-2 w-50"
                >
                  <strong className="text-capitalize">{s.stat.name}</strong>{" "}
                  {s.base_stat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PokemonDetails;
