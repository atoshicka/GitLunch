import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createApiService } from '../../entities/api/api-interface';
import { api } from '../../entities/api/axios-config';
import { Dish } from '../../entities/api/types/menu-types';
import { CartFeature } from '../../features/cart';
import { CartItem } from '../../features/cart/types';
import { styles } from './dish-modal-styles';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';
const apiService = createApiService(api);

const SWIPE_THRESHOLD = 80;

interface DishModalProps {
  dishId: number | null;
  visible: boolean;
  onClose: () => void;
}

interface NutritionRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const NutritionRow: React.FC<NutritionRowProps> = ({ label, value, isLast }) => (
  <View style={[styles.nutritionRow, isLast && { borderBottomWidth: 0 }]}>
    <Text style={styles.nutritionLabel}>{label}</Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

export const DishModal: React.FC<DishModalProps> = ({ dishId, visible, onClose }) => {
  const dispatch = useDispatch();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const cartItemSelector = CartFeature.selectors.selectCartItemById(dish ? String(dish.id) : '');
  const cartItem = useSelector(cartItemSelector) as CartItem | null;
  const quantity = cartItem?.quantity ?? 0;

  const fetchDish = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.getDishById(String(id));
      setDish(result);
    } catch {
      setError('Не удалось загрузить блюдо');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible && dishId !== null) {
      translateY.setValue(0);
      fetchDish(dishId);
    } else {
      const timer = setTimeout(() => {
        setDish(null);
        setError(null);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [visible, dishId, fetchDish, translateY]);

  const handleAddToCart = useCallback(() => {
    if (!dish) return;
    dispatch(
      CartFeature.actions.addToCart({
        id: String(dish.id),
        cartItemId: cartItem?.cartItemId,
        name: dish.name,
        price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
        imageSvg: dish.imageSvg,
        imageUrl: dish.image_url ? `${BASE_URL}${dish.image_url}` : undefined,
      })
    );
  }, [dispatch, dish, cartItem?.cartItemId]);

  const handleDecrease = useCallback(() => {
    if (!dish) return;
    dispatch(
      CartFeature.actions.decreaseQuantity({
        id: String(dish.id),
        cartItemId: cartItem?.cartItemId,
      })
    );
  }, [dispatch, dish, cartItem?.cartItemId]);

  const hasNutrition =
    dish?.calories !== undefined ||
    dish?.proteins !== undefined ||
    dish?.fats !== undefined ||
    dish?.carbs !== undefined;

  const nutritionRows = dish
    ? [
        dish.proteins !== undefined ? { label: 'Белки', value: `${dish.proteins} г` } : null,
        dish.fats !== undefined ? { label: 'Жиры', value: `${dish.fats} г` } : null,
        dish.carbs !== undefined ? { label: 'Углеводы', value: `${dish.carbs} г` } : null,
        dish.calories !== undefined ? { label: 'Калории', value: `${dish.calories} ккал` } : null,
      ].filter(Boolean)
    : [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Зона свайпа — handle + верхняя часть */}
        <View {...panResponder.panHandlers} style={styles.dragArea}>
          <View style={styles.handle} />
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {isLoading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        )}

        {error !== null && !isLoading && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => dishId !== null && fetchDish(dishId)}
            >
              <Text style={styles.retryButtonText}>Повторить</Text>
            </TouchableOpacity>
          </View>
        )}

        {dish !== null && !isLoading && error === null && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            {dish.image_url ? (
              <Image
                source={{ uri: `${BASE_URL}${dish.image_url}` }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>🍽</Text>
              </View>
            )}

            <View style={styles.infoBlock}>
              <Text style={styles.name}>{dish.name}</Text>

              <View style={styles.metaRow}>
                {dish.weight !== undefined && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>{dish.weight} г</Text>
                  </View>
                )}
                {dish.calories !== undefined && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>{dish.calories} ккал</Text>
                  </View>
                )}
                {dish.category?.name ? (
                  <View style={[styles.metaBadge, styles.metaBadgeGreen]}>
                    <Text style={styles.metaBadgeText}>{dish.category.name}</Text>
                  </View>
                ) : null}
              </View>

              {dish.description ? <Text style={styles.description}>{dish.description}</Text> : null}

              {dish.ingredients ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Состав</Text>
                  <Text style={styles.ingredients}>{dish.ingredients}</Text>
                </View>
              ) : null}

              {hasNutrition && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Пищевая ценность</Text>
                  <View style={styles.nutritionBlock}>
                    {nutritionRows.map((row, index) => (
                      <NutritionRow
                        key={row!.label}
                        label={row!.label}
                        value={row!.value}
                        isLast={index === nutritionRows.length - 1}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}

        {dish !== null && !isLoading && error === null && (
          <View style={styles.footer}>
            <Text style={styles.price}>{dish.price} ₽</Text>
            {quantity > 0 ? (
              <View style={styles.quantityControl}>
                <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={handleAddToCart}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                <Text style={styles.addButtonText}>В корзину</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};
