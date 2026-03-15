import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
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
import { styles } from './dish-modal-styles';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';
const apiService = createApiService(api);

interface DishModalProps {
  dishId: number | null;
  visible: boolean;
  onClose: () => void;
}

interface NutritionRowProps {
  label: string;
  value: string;
}

const NutritionRow: React.FC<NutritionRowProps> = ({ label, value }) => (
  <View style={styles.nutritionRow}>
    <Text style={styles.nutritionLabel}>{label}</Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

export const DishModal: React.FC<DishModalProps> = ({ dishId, visible, onClose }) => {
  const dispatch = useDispatch();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartItemSelector = CartFeature.selectors.selectCartItemById(dish ? String(dish.id) : '');
  const cartItem = useSelector(cartItemSelector);
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
      fetchDish(dishId);
    } else {
      setDish(null);
      setError(null);
    }
  }, [visible, dishId, fetchDish]);

  const handleAddToCart = useCallback(() => {
    if (!dish) return;
    dispatch(
      CartFeature.actions.addToCart({
        id: String(dish.id),
        name: dish.name,
        price: parseFloat(dish.price),
        imageSvg: dish.imageSvg,
        imageUrl: dish.image_url ? `${BASE_URL}${dish.image_url}` : undefined,
      })
    );
  }, [dispatch, dish]);

  const handleDecrease = useCallback(() => {
    if (!dish) return;
    dispatch(CartFeature.actions.decreaseQuantity(String(dish.id)));
  }, [dispatch, dish]);

  const hasNutrition =
    dish?.calories !== undefined ||
    dish?.proteins !== undefined ||
    dish?.fats !== undefined ||
    dish?.carbs !== undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />

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
                    {dish.proteins !== undefined && (
                      <NutritionRow label="Белки" value={`${dish.proteins} г`} />
                    )}
                    {dish.fats !== undefined && (
                      <NutritionRow label="Жиры" value={`${dish.fats} г`} />
                    )}
                    {dish.carbs !== undefined && (
                      <NutritionRow label="Углеводы" value={`${dish.carbs} г`} />
                    )}
                    {dish.calories !== undefined && (
                      <NutritionRow label="Калории" value={`${dish.calories} ккал`} />
                    )}
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
      </View>
    </Modal>
  );
};
