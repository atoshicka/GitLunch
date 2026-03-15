import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback, useRef } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import { Images } from '../constants/images';
import { TAB_NAMES } from '../constants/navigation';
import { styles } from './tab-bar-styles';

const { width } = Dimensions.get('window');

const NavigKrugIcon = Images.navigation.nanigKrug;
const NavWaveIcon = Images.navigation.navig;
const HomeIcon = Images.navigation.home;
const MenuIcon = Images.navigation.menu;
const BasketIcon = Images.navigation.basket;

type SvgComponent = React.FC<SvgProps>;

const TAB_ICONS: Record<string, SvgComponent> = {
  [TAB_NAMES.HOME]: HomeIcon,
  [TAB_NAMES.MENU]: MenuIcon,
  [TAB_NAMES.BASKET]: BasketIcon,
};

const MAIN_TABS = [TAB_NAMES.HOME, TAB_NAMES.MENU, TAB_NAMES.BASKET] as const;
type MainTabName = (typeof MAIN_TABS)[number];

interface TabLayout {
  left: MainTabName;
  center: MainTabName | null;
  right: MainTabName;
}

export const TAB_BAR_HEIGHT = 90;
export const TAB_BAR_CIRCLE_OVERFLOW = 8;

const WAVE_HEIGHT = 70;
const CIRCLE_SIZE = 64;

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const previousMainTab = useRef<MainTabName>(TAB_NAMES.HOME);

  const currentRouteName = state.routes[state.index].name;
  const isAccountScreen = currentRouteName === TAB_NAMES.ACCOUNT;

  const isMainTab = (name: string): name is MainTabName =>
    (MAIN_TABS as readonly string[]).includes(name);

  if (isMainTab(currentRouteName)) {
    previousMainTab.current = currentRouteName;
  }

  const getLayout = (): TabLayout => {
    const activeInMain: MainTabName = previousMainTab.current;
    const others = MAIN_TABS.filter((name) => name !== activeInMain) as [MainTabName, MainTabName];
    return {
      left: others[0],
      center: isAccountScreen ? null : activeInMain,
      right: others[1],
    };
  };

  const layout = getLayout();
  const circleBottom = WAVE_HEIGHT - CIRCLE_SIZE / 2 + TAB_BAR_CIRCLE_OVERFLOW;

  const handleTabPress = useCallback(
    (routeName: string) => {
      const route = state.routes.find((r) => r.name === routeName);
      if (!route) return;
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!event.defaultPrevented) {
        navigation.navigate(routeName, undefined);
      }
    },
    [navigation, state.routes]
  );

  const renderIcon = (
    routeName: MainTabName,
    size: number,
    opacity: number = 1
  ): React.ReactElement | null => {
    const Icon = TAB_ICONS[routeName];
    if (!Icon) return null;
    return <Icon width={size} height={size} style={{ opacity }} />;
  };

  return (
    <View
      style={[styles.wrapper, { height: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW + insets.bottom }]}
      pointerEvents="box-none"
    >
      {/* Волна — всегда видна */}
      <View style={[styles.waveContainer, { bottom: insets.bottom, height: WAVE_HEIGHT }]}>
        <NavWaveIcon width={width} height={WAVE_HEIGHT} preserveAspectRatio="none" />
      </View>

      {/* Боковые кнопки и кружок — только НЕ на аккаунте */}
      {!isAccountScreen && (
        <>
          <View style={[styles.sideButtonsRow, { bottom: insets.bottom + WAVE_HEIGHT / 2 - 22 }]}>
            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => handleTabPress(layout.left)}
              activeOpacity={0.7}
            >
              {renderIcon(layout.left, 28, 0.8)}
            </TouchableOpacity>

            <View style={{ width: CIRCLE_SIZE + 16 }} />

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => handleTabPress(layout.right)}
              activeOpacity={0.7}
            >
              {renderIcon(layout.right, 28, 0.8)}
            </TouchableOpacity>
          </View>

          {layout.center !== null && (
            <View
              style={[
                styles.circleWrapper,
                {
                  bottom: insets.bottom + circleBottom,
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                },
              ]}
              pointerEvents="none"
            >
              <NavigKrugIcon width={CIRCLE_SIZE} height={CIRCLE_SIZE} />
              <View style={styles.circleIcon}>{renderIcon(layout.center, 30)}</View>
            </View>
          )}
        </>
      )}
    </View>
  );
};
