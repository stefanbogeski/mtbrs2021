import { Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;
export const wavHeight = screenWidth * 0.365;

export const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
}

export const isLandscape = () => {
  const dim = Dimensions.get('screen');
  return dim.height <= dim.width;
}

export default {
  window: {
    width: windowWidth,
    height: windowHeight,
  },
  isSmallDevice: windowWidth < 375,
};

export const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get('screen'));

  useEffect(() => {
      const onChange = result => {
          setScreenData(result.screen);
      };
      Dimensions.addEventListener('change', onChange);
      return () => Dimensions.removeEventListener('change', onChange);
  });

  return {
      ...screenData,
      isLandscape: screenData.width > screenData.height,
  };
};