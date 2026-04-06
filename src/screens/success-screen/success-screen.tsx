import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Images } from '../../shared/constants/images';
import { SCREEN_NAMES } from '../../shared/constants/navigation';
import { successStyles } from './success-screen-styles';

type SuccessNavProp = NativeStackNavigationProp<RootStackParamList, 'Success'>;

const SubtractIcon = Images.home.wave;
const SettingsIcon = Images.account.setting;
const SuccessIcon = Images.other.success;
const NavigIcon = Images.navigation.navig;

export const SuccessScreen: React.FC = () => {
  const navigation = useNavigation<SuccessNavProp>();

  return (
    <View style={successStyles.container}>
      <View style={successStyles.waveSection} pointerEvents="none">
        <View style={successStyles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={successStyles.waveContent}>
        <View style={successStyles.topBar}>
          <TouchableOpacity
            style={successStyles.topBarButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.TABS, { screen: 'Главная' })}
          >
            <Text style={successStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={successStyles.brandTitle}>GitLunch</Text>
          <TouchableOpacity style={successStyles.topBarButton}>
            <SettingsIcon width={24} height={24} fill="#1F2937" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={successStyles.centerContent}>
        <View style={successStyles.iconContainer}>
          <SuccessIcon width={80} height={80} />
        </View>

        <Text style={successStyles.successTitle}>Ваш заказ оформлен!</Text>
        <Text style={successStyles.successSubTitle}>Отправили его в предприятие</Text>
      </View>

      <View style={successStyles.navigSection} pointerEvents="none">
        <View style={successStyles.navigBackground}>
          <NavigIcon width="100%" height="100%" preserveAspectRatio="xMidYMax slice" />
        </View>
      </View>
    </View>
  );
};
