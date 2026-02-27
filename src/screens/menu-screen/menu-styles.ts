import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#1F2937',
  },
  cafeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495E7C',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  dishesGrid: {
    paddingHorizontal: 16,
  },
  dishCard: {
    width: cardWidth,
    marginRight: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePlaceholder: {
    fontSize: 40,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    height: 40,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1BB910',
  },
  addButton: {
    backgroundColor: '#1BB910',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    backgroundColor: '#1BB910',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    minWidth: 20,
    textAlign: 'center',
  },
  filters: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 32,
  },
  filtersWrapper: {
    marginBottom: 16,
    minHeight: 44,
    backgroundColor: '#F8FAFC',
  },
});
