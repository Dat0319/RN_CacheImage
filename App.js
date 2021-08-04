import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {
  CachedImage,
  ImageCacheProvider,
  ImageCacheManager,
  ImageCacheManagerOptions,
} from './cache';

const App = () => {
  const info = ImageCacheManager();
  const images = [
    'https://media.wired.com/photos/59822d6c5350085419ca1488/master/w_1920,c_limit/PeacockHP-691483428.jpg',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1627933907906-6075f7c88da5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1627959449026-fab24729be4e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  ];

  useEffect(() => {
    console.log(info.getCacheInfo());
  }, []);

  return (
    <View style={styles.container}>
        <Text>Content</Text>
        <ImageCacheProvider
          urlsToPreload={images}
          onPreloadComplete={() => console.log('hey there')}>
          <ScrollView>
            {
              images.map((item, index) => {
                return <CachedImage key={index} style={styles.images} source={{uri: images[index]}} />
              })
            }
          </ScrollView>
        </ImageCacheProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  images: {
    width: '100%',
    minWidth: 100,
    height: 100,
    marginBottom: 10
  }
});

export default App;
