import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Pokemon, getPokemon } from '@/api/pokeapi';

const Page = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await getPokemon();
      console.log(result);
    };
    load();
  }, []);
  return (
    <View>
      <Link href="/test">
        <Text>Details</Text>
      </Link>
    </View>
  );
};

export default Page;
