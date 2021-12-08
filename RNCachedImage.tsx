import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import View from '../view/View';
// import Image from 'components/ui/image/Image';
// import { useCacheImage } from 'context/image-cache-provider/ImageCacheProvider';
// import { useSelector } from 'react-redux';
import FastImage, { FastImageProps } from 'react-native-fast-image';

type Props = FastImageProps & {
  source: string;
};

const RNCacheImage: FC<Props> = ({ source, ...other }) => {
  // const [loading, setLoading] = useState(true);
  // const [cachedSource, setCachedSource] = useState('');
  // const cachedImage = useCacheImage();
  // const isConnectNetwork = useSelector(
  //   (store: StoreState) => store.common.isConnectNetwork,
  // );

  // useEffect(() => {
  //   const cached = cachedImage.getCachedEntry(source);
  //   if (!!!cached) {
  //     cachedImage.downloadAndCache(source);
  //   }
  // }, [cachedImage, source, isConnectNetwork]);

  // const handleChooseSource = () => {
  //   const cached = cachedImage.getCachedEntry(source);
  //   if (!!cached) {
  //     return cachedSource;
  //   } else {
  //     return isConnectNetwork ? source : cachedSource;
  //   }
  // };

  // useEffect(() => {
  //   const cached = cachedImage.getCachedEntry(source);
  //   if (cached) {
  //     setCachedSource(cached);
  //     setLoading(false);
  //     return;
  //   }
  //   const caching = cachedImage.getCachingMapEntry(source);
  //   if (!!caching) {
  //     const remove = caching?.addListener((c) => {
  //       setCachedSource(c);
  //       setLoading(false);
  //     });
  //     return () => remove();
  //   }
  //   cachedImage.downloadAndCache(source).then((c) => {
  //     setCachedSource(c);
  //     setLoading(false);
  //   });
  // }, [cachedImage, source, cachedSource]);

  // useEffect(() => {
  //   const cached = cachedImage.getCachedEntry(source);
  //   if (cached) {
  //     setCachedSource(cached);
  //     setLoading(false);
  //     return;
  //   }
  //   const caching = cachedImage.getCachingMapEntry(source);
  //   if (!!caching) {
  //     const remove = caching?.addListener((c) => {
  //       setCachedSource(c);
  //       setLoading(false);
  //     });
  //     return () => remove();
  //   }
  //   cachedImage.downloadAndCache(source).then((c) => {
  //     setCachedSource(c);
  //     setLoading(false);
  //   });
  // }, [cachedImage, source, cachedSource]);
  // if (loading) {
  //   return null;
  // }
  source =
    'https://media.wired.com/photos/593261cab8eb31692072f129/master/pass/85120553.jpg';
  console.log('path: ', FastImage.getCachePath({ uri: source }));

  return (
    <View style={styles.container}>
      <FastImage
        // key={cachedSource}
        // fadeDuration={0}
        source={{
          // uri: handleChooseSource(),
          uri: source,
          priority: FastImage.priority.low,
        }}
        style={styles.image}
        {...other}
      />
    </View>
  );
};

export default RNCacheImage;

const styles = StyleSheet.create({
  container: {},
  image: {
    width: '100%',
    height: '100%',
  },
});
