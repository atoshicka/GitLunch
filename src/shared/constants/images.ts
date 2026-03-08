import Desserts from '../../assets/images/desserts.svg';
import Hot from '../../assets/images/hot.svg';
import Logo from '../../assets/images/logo.svg';
import Nowin from '../../assets/images/nowin.svg';
import RestCezar from '../../assets/images/restCezar.svg';
import Salads from '../../assets/images/salads.svg';
import Search from '../../assets/images/search.svg';
import Snacks from '../../assets/images/snacks.svg';
import Subtract from '../../assets/images/subtract.svg';
import Vector1 from '../../assets/images/vector1.svg';
import Vector2 from '../../assets/images/vector2.svg';

export const Images = {
  filters: {
    hot: Hot,
    salads: Salads,
    snacks: Snacks,
    desserts: Desserts,
  },
  auth: {
    vector1: Vector1,
    vector2: Vector2,
    logo: Logo,
  },
  search: {
    icon: Search,
  },
  home: {
    wave: Subtract,
    restCezar: RestCezar,
    nowin: Nowin,
  },
  promo: {
    placeholder: '🍽️',
  },
} as const;
