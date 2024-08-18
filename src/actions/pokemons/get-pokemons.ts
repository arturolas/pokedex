import { pokeApi } from "../../config/api/pokeApi";
import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokeApiPaginatedResponse, PokeAPIPokemon } from '../../infrastructure/interfaces/pokeapi.interfaces';
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";

/* PARA QUE LA PETICIÓN DEMORE DOS SEGUNDOS
export const sleep = async() =>{
    return new Promise(resolve => setTimeout(resolve, 2000));
}
*/

export const getPokemons = async (page: number, limit: number = 20):Promise<Pokemon[]> => {

    //await sleep();

    try{

        const url = `/pokemon?offset=${ page * 10 }&limit=${ limit }`;
        const { data } = await pokeApi.get<PokeApiPaginatedResponse>(url);

        const pokemonPromises = data.results.map( (info) => {
            return pokeApi.get<PokeAPIPokemon>(info.url);
        })

        const pokeApiPokemons = await Promise.all(pokemonPromises);

        const pokemonsPromises = pokeApiPokemons.map( (item) => PokemonMapper.pokeApiPokemonToEntity(item.data),);

        //console.log(pokeApiPokemons);
        //console.log(data);

        return await Promise.all(pokemonsPromises);

    } catch (error) {
        console.log(error);
        throw new Error('Error getting pokemons');
    }

}