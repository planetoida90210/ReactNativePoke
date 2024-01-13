import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { storage } from '@/api/mmkv';
import { Pokemon, getPokemonDetail } from '@/api/pokeapi';
import { useQueries } from '@tanstack/react-query';

const Page = () => {
  const [keys, setKeys] = useState(storage.getAllKeys());
  const [data, setData] = useState<Pokemon[]>([]);

  const pokemonQueries = useQueries({
    queries: keys.map((key) => {
      const pokemonId = key.split('-')[1];
      return {
        queryKey: ['pokemon', pokemonId],
        queryFn: () => getPokemonDetail(pokemonId),
      };
    }),
  });
  return (
    <ScrollView>
      {pokemonQueries.map((q) => (
        <Text>{q.data?.name}</Text>
      ))}
      <Text>favorites</Text>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  item: {
    height: 100,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    textTransform: 'capitalize',
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  preview: {
    width: 100,
    height: 100,
  },
});
