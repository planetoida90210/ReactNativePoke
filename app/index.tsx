import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Pokemon, getPokemon } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const pokemonQuery = useQuery({
    queryKey: ['pokemon'],
    queryFn: getPokemon,
  });

  return (
    <ScrollView>
      {pokemonQuery.isLoading && (
        <ActivityIndicator style={{ marginTop: 30 }} />
      )}
      {pokemonQuery.data &&
        pokemonQuery.data.map((p) => (
          <Link href={`/(pokemon)/${p.id}`} key={p.id} asChild>
            <TouchableOpacity>
              <View style={styles.item}>
                <Image source={{ uri: p.image }} style={styles.preview} />
                <Text style={styles.itemText}>{p.name}</Text>
                <Ionicons name="chevron-forward" size={24} />
              </View>
            </TouchableOpacity>
          </Link>
        ))}
    </ScrollView>
  );
};

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

export default Page;
