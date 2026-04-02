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

import { BASE_URL, createApiService } from '../../entities/api/api-interface';
import { api } from '../../entities/api/axios-config';
import { Dish } from '../../entities/api/types/menu-types';
import { CartFeature } from '../../features/cart';
import { CartItem } from '../../features/cart/types';
import { styles } from './dish-modal-styles';

const apiService = createApiService(api);
const SWIPE_THRESHOLD = 80;

interface DishModalProps {
  dishId: number | null;
  visible: boolean;
  onClose: () => void;
}

interface NutritionItem {
  label: string;
  value: string;
}

const NutritionRow: React.FC<NutritionItem & { isLast?: boolean }> = ({ label, value, isLast }) => (
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
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 0,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy > SWIPE_THRESHOLD) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const cartItem = useSelector(
    CartFeature.selectors.selectCartItemById(dish ? String(dish.id) : '')
  ) as CartItem | null;
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

  const handleCartAction = useCallback(
    (type: 'add' | 'decrease') => {
      if (!dish) return;
      const action =
        type === 'add' ? CartFeature.actions.addToCart : CartFeature.actions.decreaseQuantity;

      dispatch(
        action({
          id: String(dish.id),
          cartItemId: cartItem?.cartItemId,
          name: dish.name,
          price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
          imageSvg: dish.imageSvg,
          imageUrl: dish.image_url ? `${BASE_URL}${dish.image_url}` : undefined,
        })
      );
    },
    [dispatch, dish, cartItem]
  );

  const nutritionData: NutritionItem[] = dish
    ? [
        dish.proteins !== undefined && { label: 'Белки', value: `${dish.proteins} г` },
        dish.fats !== undefined && { label: 'Жиры', value: `${dish.fats} г` },
        dish.carbs !== undefined && { label: 'Углеводы', value: `${dish.carbs} г` },
        dish.calories !== undefined && { label: 'Калории', value: `${dish.calories} ккал` },
      ].filter((item): item is NutritionItem => Boolean(item))
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
        <View {...panResponder.panHandlers} style={styles.dragArea}>
          <View style={styles.handle} />
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => dishId && fetchDish(dishId)}
            >
              <Text style={styles.retryButtonText}>Повторить</Text>
            </TouchableOpacity>
          </View>
        ) : (
          dish && (
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
                  {dish.weight && (
                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeText}>{dish.weight} г</Text>
                    </View>
                  )}
                  {dish.category?.name && (
                    <View style={[styles.metaBadge, styles.metaBadgeGreen]}>
                      <Text style={styles.metaBadgeText}>{dish.category.name}</Text>
                    </View>
                  )}
                </View>

                {dish.description && <Text style={styles.description}>{dish.description}</Text>}

                {dish.ingredients && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Состав</Text>
                    <Text style={styles.ingredients}>{dish.ingredients}</Text>
                  </View>
                )}

                {nutritionData.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Пищевая ценность</Text>
                    <View style={styles.nutritionBlock}>
                      {nutritionData.map((item, index) => (
                        <NutritionRow
                          key={item.label}
                          {...item}
                          isLast={index === nutritionData.length - 1}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          )
        )}

        {dish && !isLoading && !error && (
          <View style={styles.footer}>
            <Text style={styles.price}>{dish.price} ₽</Text>
            {quantity > 0 ? (
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleCartAction('decrease')}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleCartAction('add')}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={() => handleCartAction('add')}>
                <Text style={styles.addButtonText}>В корзину</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};
