import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
import SHA1 from 'crypto-js/sha1';
import { AndroidOS } from 'utils/platform.util';

interface Context {
  cachingEntryMap: Record<string, CacheEntry>;
  downloadAndCache: (source: string, path?: string) => Promise<string>;
  getCachedEntry: (src: string) => string | undefined;
  getCachingMapEntry: (src: string) => CacheEntry | undefined;
  removeCacheEntry: (src: string) => {};
}

const ImageCacheContext = React.createContext<Context | null>(null);

const BASE_DIR = RNFetchBlob.fs.dirs.CacheDir + '/image';

class CacheEntry {
  source: string;
  path: string;
  isDownloading: boolean = false;
  listener: ((src: string) => void)[] = [];

  constructor(source: string, toPath: string) {
    this.source = source;
    this.path = toPath;
  }

  download() {
    this.isDownloading = true;
    return new Promise<{ data: string; fsTask: Promise<void> }>(
      async (resolve, reject) => {
        try {
          const response = await RNFetchBlob.fetch('get', this.source);
          const contentType = response.respInfo.headers['Content-Type'];
          const data = {
            fsTask: RNFetchBlob.fs.writeFile(
              this.path,
              response.data,
              'base64',
            ),
            data: `data:${contentType};base64,${response.data}`,
          };
          this.listener.forEach((i) => {
            i(data.data);
          });
          resolve(data);

          // startWriteFile;
        } catch (e) {
          // todo
          reject(new Error('Cannot download image for path: ' + this.source));
        }
        // if (a.status !== 200) {
        //   reject(new Error('Cannot download image for path: ' + this.source));
        // }
        // this.isDownloading = false;
        // this.listener.forEach((i) => {
        //   i(this.path);
        // });
        // this.listener = [];
        // resolve(this.path);
      },
    );
  }
  addListener(cb: (src: string) => void) {
    this.listener.push(cb);
    return () => {
      this.listener = this.listener.filter((i) => i !== cb);
    };
  }
}

const cacheMapKey = '@cache_map12346';

const ImageCacheProvider: FC = ({ children }) => {
  const [initializing, setInitializing] = useState(false);
  const cachingEntryMap = useRef<Record<string, CacheEntry>>({});
  const cachedMapEntry = useRef<Record<string, string>>({});

  const setCachingEntryMap = useCallback((source, cacheEntry) => {
    cachingEntryMap.current = {
      ...cachingEntryMap.current,
      [source]: cacheEntry,
    };
  }, []);

  const setCachedMapEntry = useCallback((source, path) => {
    cachedMapEntry.current = {
      ...cachedMapEntry.current,
      [source]: AndroidOS ? `file://${path}` : path,
    };
    AsyncStorage.setItem(cacheMapKey, JSON.stringify(cachedMapEntry.current));
  }, []);

  const generatePath = useCallback((source) => {
    const filename = source.substring(
      source.lastIndexOf('/'),
      source.indexOf('?') === -1 ? source.length : source.indexOf('?'),
    );
    const ext =
      filename.indexOf('.') === -1
        ? '.jpg'
        : filename.substring(filename.lastIndexOf('.'));
    const sha = SHA1(source);
    const path = `${BASE_DIR}${sha}${ext}`;
    return path;
  }, []);

  const downloadAndCache = useCallback(
    (source: string, toPath: string = generatePath(source)) => {
      return new Promise<string>((resolve) => {
        const cacheEntry = new CacheEntry(source, toPath);
        setCachingEntryMap(source, cacheEntry);
        return cacheEntry.download().then(({ data, fsTask }) => {
          resolve(data);
          fsTask.then(() => {
            setCachedMapEntry(source, toPath);
          });
        });
      });
    },
    [generatePath, setCachedMapEntry, setCachingEntryMap],
  );

  const getCachedEntry = useCallback((source: string) => {
    if (Object.keys(cachedMapEntry.current).length === 0) {
      AsyncStorage.getItem(cacheMapKey).then((res) => {
        if (res) {
          cachedMapEntry.current = JSON.parse(res);
        }
      });
    }
    if (cachedMapEntry.current[source]) {
      return cachedMapEntry.current[source];
    }
  }, []);

  const getCachingMapEntry = useCallback(
    (source: string) => {
      if (cachingEntryMap.current[source]) {
        return cachingEntryMap.current[source];
      }
    },
    [cachingEntryMap],
  );

  const removeCacheEntry = useCallback(
    (src: string) => {
      let tempCachingEntryMap = { ...cachingEntryMap.current };
      delete tempCachingEntryMap[src];
      cachingEntryMap.current = tempCachingEntryMap;
      RNFetchBlob.fs.unlink(generatePath(src));
    },
    [generatePath],
  );

  useEffect(() => {
    AsyncStorage.getItem(cacheMapKey).then((res) => {
      if (res) {
        cachedMapEntry.current = JSON.parse(res);
      }
      setInitializing(false);
      return null;
    });
  }, []);

  useEffect(() => {
    // RNFetchBlob.fs.mkdir(BASE_DIR).catch();
  }, []);

  const contextValue = useMemo(
    () => ({
      cachingEntryMap: cachingEntryMap.current,
      downloadAndCache,
      getCachedEntry,
      getCachingMapEntry,
      removeCacheEntry,
    }),
    [downloadAndCache, getCachedEntry, getCachingMapEntry, removeCacheEntry],
  );

  if (initializing) {
    return null;
  }
  return (
    <ImageCacheContext.Provider value={contextValue}>
      {children}
    </ImageCacheContext.Provider>
  );
};

export default ImageCacheProvider;

export function useCacheImage() {
  const context = useContext(ImageCacheContext);
  if (!context) {
    throw new Error('component is not wrapped inside ImageCacheProvider');
  }
  return context;
}
