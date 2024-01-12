import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Pokemon, getPokemon } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const pokemonQuery = useQuery({
    queryKey: ['pokemon'],
    queryFn: getPokemon,
    refetchOnMount: false,
  });

  const renderItem: ListRenderItem<Pokemon> = ({ item }) => (
    <Link href={`/(pokemon)/${item.id}`} key={item.id} asChild>
      <TouchableOpacity>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.preview} />
          <Text style={styles.itemText}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={24} />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={{ flex: 1 }}>
      {pokemonQuery.isLoading && (
        <ActivityIndicator style={{ marginTop: 30 }} />
      )}
      <FlashList
        data={pokemonQuery.data}
        renderItem={renderItem}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, width: '100%', backgroundColor: '#dfdfdf' }}
          />
        )}
      />
    </View>
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
