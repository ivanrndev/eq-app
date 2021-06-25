import React from 'react';
import My from '../assets/svg/my.svg';
import WriteOff from '../assets/svg/writeOff.svg';
import Services from '../assets/svg/services.svg';
import AcceptGive from '../assets/svg/acceptGive.svg';
import Inventory from '../assets/svg/inventory.svg';
import Mark from '../assets/svg/mark.svg';
import Ident from '../assets/svg/ident.svg';
import Left from '../assets/svg/left-arrow.svg';
import Right from '../assets/svg/right-arrow.svg';
import Close from '../assets/svg/cancel.svg';
import Create from '../assets/svg/plus.svg';

export const menuSvg = item => {
  switch (item) {
    case 'my':
      return <My width={20} height={20} />;
    case 'writeOff':
      return <WriteOff width={20} height={20} />;
    case 'services':
      return <Services width={20} height={20} />;
    case 'acceptGive':
      return <AcceptGive width={20} height={20} />;
    case 'inventory':
      return <Inventory width={20} height={20} />;
    case 'marking':
      return <Mark width={20} height={20} />;
    case 'ident':
      return <Ident width={20} height={20} />;
    case 'left':
      return <Left width={20} height={20} />;
    case 'right':
      return <Right width={20} height={20} />;
    case 'close':
      return <Close width={20} height={20} />;
    case 'create':
      return <Create width={20} height={20} />;
    default:
      return null;
  }
};
