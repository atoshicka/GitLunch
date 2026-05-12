import { Dimensions, StyleSheet } from 'react-native';
import { Typography } from '../../shared/fontsFile/fonts';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#86EFAC',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    paddingTop: 10,
  },
  floatingHeaderSafe: {
    width: '100%',
  },
  floatingHeaderContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  waveSection: {
    position: 'relative',
    height: 220,
    backgroundColor: 'transparent',
    marginBottom: -70,
    zIndex: 1,
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 42,
  },
  contentWrapper: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    zIndex: 2,
  },
  sectionTitle: {
    ...Typography.titleSmall,
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  restaurantTextBlock: {
    backgroundColor: '#1BB910',
    borderRadius: 25,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImageBlock: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    height: 150,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantBlockText: {
    ...Typography.decorativeSmall,
    fontSize: 22,
    color: '#1F2937',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
    fontWeight: '600',
  },
  carouselItem: {
    width: width,
    paddingHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1F2937',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#22C55E',
    width: 24,
  },
  promoSection: {
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  promoList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  promoCardContainer: {
    width: cardWidth,
    marginRight: 12,
  },
});
