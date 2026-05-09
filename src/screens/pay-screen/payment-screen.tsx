import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { CartFeature } from '../../features/cart';
import { OrdersFeature } from '../../features/orders';
import { Images } from '../../shared/constants/images';
import { TAB_NAMES } from '../../shared/constants/navigation/navigation';
import { OrderButton } from '../../shared/order-button/order-button';
import {
  showOrderCreatedNotification,
  showOrderErrorNotification,
} from '../../shared/utils/notifications';
import { paymentStyles } from './payment-screen-styles';

type PaymentNavProp = NativeStackNavigationProp<RootStackParamList>;

const SubtractIcon = Images.home.wave;
const SettingsIcon = Images.account.setting;
const SBPIcon = Images.other.sbp;

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<PaymentNavProp>();
  const dispatch = useDispatch();

  const totalPrice = useSelector(CartFeature.selectors.selectTotalPrice);
  const totalItems = useSelector(CartFeature.selectors.selectTotalItemsCount);
  const selectedDates = useSelector(CartFeature.selectors.selectSelectedDates);
  const isCreating = useSelector(OrdersFeature.selectors.selectIsCreating);
  const error = useSelector(OrdersFeature.selectors.selectError);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const isPendingRef = useRef(false);

  const isFormValid = useMemo(
    () => cardNumber.length === 16 && expiry.length === 4 && cvc.length === 3,
    [cardNumber, expiry, cvc]
  );

  useEffect(() => {
    if (!isPendingRef.current) return;
    if (isCreating) return;

    isPendingRef.current = false;

    if (error) {
      showOrderErrorNotification();
      navigation.navigate(TAB_NAMES.ERROR as never);
    } else {
      showOrderCreatedNotification();
      navigation.navigate(TAB_NAMES.SUCCESS as never);
    }
  }, [isCreating, error, navigation]);

  const formatCardNumber = (text: string) =>
    text
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();

  const formatExpiry = (text: string) => {
    const clean = text.replace(/\D/g, '');
    return clean.length >= 2 ? `${clean.slice(0, 2)}/${clean.slice(2, 4)}` : clean;
  };

  const handlePay = useCallback(() => {
    if (!isFormValid || isCreating) return;

    const isoSelectedDates = selectedDates.map((date) => {
      const parts = date.split('.');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return date;
    });

    isPendingRef.current = true;
    dispatch(OrdersFeature.actions.createOrder({ selected_dates: isoSelectedDates }));
    dispatch(CartFeature.actions.clearSelectedDays(selectedDates));
  }, [isFormValid, isCreating, selectedDates, dispatch]);

  return (
    <View style={paymentStyles.container}>
      <View style={paymentStyles.waveSection} pointerEvents="none">
        <View style={paymentStyles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={paymentStyles.waveContent}>
        <View style={paymentStyles.topBar}>
          <TouchableOpacity style={paymentStyles.topBarButton} onPress={() => navigation.goBack()}>
            <Text style={paymentStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={paymentStyles.brandTitle}>GitLunch</Text>
          <TouchableOpacity style={paymentStyles.topBarButton}>
            <SettingsIcon width={26} height={26} fill="#1F2937" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={paymentStyles.content}>
        <View style={paymentStyles.section}>
          <Text style={paymentStyles.label}>Адрес доставки</Text>
          <View style={paymentStyles.disabledInput}>
            <Text style={paymentStyles.disabledInputText}>Чкалова 3</Text>
          </View>
        </View>

        <View style={{ width: '100%', marginBottom: 5 }}>
          <Text style={paymentStyles.label}>Способ оплаты</Text>
        </View>

        <View style={paymentStyles.sbpContainer}>
          <TouchableOpacity activeOpacity={0.7}>
            <SBPIcon width={100} height={50} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['#86EFAC', '#1CD961']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={paymentStyles.cardBlock}
        >
          <Text style={paymentStyles.cardBlockTitle}>Реквизиты</Text>

          <TextInput
            style={paymentStyles.input}
            placeholder="Номер карты"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            maxLength={19}
            value={formatCardNumber(cardNumber)}
            onChangeText={(t) => setCardNumber(t.replace(/\D/g, ''))}
          />

          <View style={paymentStyles.row}>
            <TextInput
              style={[paymentStyles.input, { flex: 1 }]}
              placeholder="M/D"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={5}
              value={formatExpiry(expiry)}
              onChangeText={(t) => setExpiry(t.replace(/\D/g, ''))}
            />
            <View style={{ width: 16 }} />
            <TextInput
              style={[paymentStyles.input, { flex: 1 }]}
              placeholder="CVC"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              value={cvc}
              onChangeText={(t) => setCvc(t.replace(/\D/g, ''))}
            />
          </View>
        </LinearGradient>

        <OrderButton onPress={handlePay} isLoading={isCreating} disabled={!isFormValid} />
      </View>
    </View>
  );
};
