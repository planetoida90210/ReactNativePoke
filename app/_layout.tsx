import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#f4511e' } }}>
      <Stack.Screen name="index" options={{ title: 'Pokedex' }} />
    </Stack>
  );
};

export default _layout;
