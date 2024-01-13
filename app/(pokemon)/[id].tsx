import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Pokemon, getPokemonDetail } from '@/api/pokeapi';
import { storage } from '@/api/mmkv';
import Animated, {
  FadeIn,
  FadeInDown,
  FlipInEasyX,
} from 'react-native-reanimated';

const Page = () => {
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isFavorite, setIsFavorite] = useState<boolean>(
    storage.getString(`favorite-${id}`) === 'true'
  );

  const navigation = useNavigation();

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonDetail(id!),
    refetchOnMount: false,
    placeholderData: () => {
      return queryClient.getQueryData(['pokemon', id]);
    },
  });
  useEffect(() => {
    if (pokemonQuery.isSuccess && pokemonQuery.data) {
      const title =
        pokemonQuery.data.name.charAt(0).toUpperCase() +
        pokemonQuery.data.name.slice(1);
      navigation.setOptions({ title });
    }
  }, [pokemonQuery.data, pokemonQuery.isSuccess, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={22}
            color={'#fff'}
          />
        </Text>
      ),
    });
  }, [isFavorite]);

  const toggleFavorite = async () => {
    const newFavoriteStatus = !isFavorite;
    storage.set(`favorite-${id}`, newFavoriteStatus ? 'true' : 'false');
    setIsFavorite(newFavoriteStatus);
  };

  return (
    <View style={{ padding: 10 }}>
      {pokemonQuery.data && (
        <>
          <Animated.View
            entering={FadeIn.delay(200)}
            style={[styles.card, { alignItems: 'center' }]}
          >
            <Image
              source={{ uri: pokemonQuery.data.sprites.front_default }}
              style={styles.preview}
            />
            <Animated.Text
              entering={FlipInEasyX.delay(300)}
              style={styles.name}
            >
              #{pokemonQuery.data.id} {pokemonQuery.data.name}
            </Animated.Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)} style={styles.card}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Stats:</Text>
            {pokemonQuery.data.stats.map((item: any) => (
              <Text key={item.stat.name}>
                {item.stat.name} : {item.base_stat}
              </Text>
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    elevation: 1,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  preview: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textTransform: 'capitalize',
  },
});

export default Page;
