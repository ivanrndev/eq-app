import React from 'react';
import My from '../assets/svg/my.svg';
import WriteOff from '../assets/svg/writeOff.svg';
import Services from '../assets/svg/services.svg';
import AcceptGive from '../assets/svg/acceptGive.svg';
import Inventory from '../assets/svg/inventory.svg';
import Mark from '../assets/svg/mark.svg';
import Ident from '../assets/svg/ident.svg';

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
    default:
      return null;
  }
};
