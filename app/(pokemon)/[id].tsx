import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Pokemon, getPokemonDetail } from '@/api/pokeapi';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [details, setDetails] = useState<Pokemon>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      const details = await getPokemonDetail(id!);
      setDetails(details);
      navigation.setOptions({
        title: details.name.charAt(0).toUpperCase() + details.name.slice(1),
      });
      const isFavorite = await AsyncStorage.getItem(`favorite-${id}`);
      setIsFavorite(isFavorite === 'true');
    };
    load();
  }, [id]);

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
    await AsyncStorage.setItem(
      `favorite-${id}`,
      !isFavorite ? 'true' : 'false'
    );
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={{ padding: 10 }}>
      {details && (
        <>
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Image
              source={{ uri: details.sprites.front_default }}
              style={styles.preview}
            />
            <Text style={styles.name}>
              #{details.id} {details.name}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Stats:</Text>
            {details.stats.map((item: any) => (
              <Text key={item.stat.name}>
                {item.stat.name} : {item.base_stat}
              </Text>
            ))}
          </View>
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
